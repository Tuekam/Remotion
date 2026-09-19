import type {
  ElevenLabsClient,
  ElevenLabsSynthesisRequest,
  ElevenLabsSynthesisResult,
  ElevenLabsTranscriptionResult,
} from "../contracts/ElevenLabsClient.js";
import type { VoiceOverAlignment } from "../../../../core/models/VoiceOver.js";
import { measureMp3DurationMs } from "./Mp3Duration.js";
import { mapTranscriptionResponse } from "./ElevenLabsTranscriptionMapper.js";

const MAX_TTS_ATTEMPTS = 3;

interface ElevenLabsResponse {
  audio_base64?: string;
  alignment?: ElevenLabsAlignment;
  normalized_alignment?: ElevenLabsAlignment;
}

interface ElevenLabsAlignment {
  chars?: string[];
  char_start_times_ms?: number[];
  char_durations_ms?: number[];
}

/** Orchestre les opérations du composant ElevenLabsClientImpl dans le flux applicatif. */
export class ElevenLabsClientImpl implements ElevenLabsClient {
/** Initialise l’instance avec les dépendances injectées nécessaires à son rôle. */
  public constructor(
    private readonly elevenLabsApiKey: string | undefined,
    private readonly elevenLabsApiBaseUrl = "https://api.elevenlabs.io",
    private readonly fetcher: typeof fetch = fetch,
  ) {}

/** Réalise l’opération synthesize sur les données reçues et retourne le résultat attendu. */
  public async synthesize(
    request: ElevenLabsSynthesisRequest,
  ): Promise<ElevenLabsSynthesisResult> {
    if (!this.elevenLabsApiKey) {
      throw new Error("ELEVENLABS_API_KEY is not configured");
    }

    if (request.text.trim().length === 0) {
      throw new Error("ElevenLabs text must not be empty");
    }

    let lastError: unknown = null;
    for (let attempt = 1; attempt <= MAX_TTS_ATTEMPTS; attempt += 1) {
      try {
        return await this.requestSynthesis(request);
      } catch (error) {
        lastError = error;
        if (attempt === MAX_TTS_ATTEMPTS) {
          throw new Error(
            `ElevenLabs synthesis failed after ${MAX_TTS_ATTEMPTS} attempts`,
            { cause: error },
          );
        }
      }
    }

    throw new Error("ElevenLabs synthesis failed", { cause: lastError });
  }

/** Réalise l’opération transcribe sur les données reçues et retourne le résultat attendu. */
  public async transcribe(
    audio: Buffer,
    languageCode?: string,
  ): Promise<ElevenLabsTranscriptionResult> {
    if (!this.elevenLabsApiKey) {
      throw new Error("ELEVENLABS_API_KEY is not configured");
    }
    if (audio.length === 0) {
      throw new Error("Audio must not be empty");
    }

    const form = new FormData();
    form.append(
      "file",
      new Blob([new Uint8Array(audio)], { type: "audio/mpeg" }),
      "voice-over.mp3",
    );
    form.append("model_id", "scribe_v2");
    if (languageCode) {
      form.append("language_code", languageCode);
    }

    const response = await this.fetcher(
      `${this.elevenLabsApiBaseUrl}/v1/speech-to-text`,
      {
        method: "POST",
        headers: { "xi-api-key": this.elevenLabsApiKey },
        body: form,
      },
    );
    if (!response.ok) {
      throw new Error(
        `ElevenLabs speech-to-text failed with status ${response.status}`,
      );
    }

    return mapTranscriptionResponse(await response.json());
  }

  private async requestSynthesis(
    request: ElevenLabsSynthesisRequest,
  ): Promise<ElevenLabsSynthesisResult> {
    const response = await this.fetcher(
      `${this.elevenLabsApiBaseUrl}/v1/text-to-speech/${encodeURIComponent(request.voiceId)}/with-timestamps`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": this.elevenLabsApiKey as string,
        },
        body: JSON.stringify({
          text: request.text,
          model_id: request.modelId,
          language_code: request.languageCode,
          output_format: request.outputFormat ?? "mp3_44100_128",
          voice_settings: request.voiceSettings
            ? {
                stability: request.voiceSettings.stability,
                similarity_boost: request.voiceSettings.similarityBoost,
                style: request.voiceSettings.style,
                use_speaker_boost: request.voiceSettings.useSpeakerBoost,
                speed: request.voiceSettings.speed,
              }
            : undefined,
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`ElevenLabs request failed with status ${response.status}`);
    }

    const payload = (await response.json()) as ElevenLabsResponse;
    if (!payload.audio_base64) {
      throw new Error("ElevenLabs response does not contain audio");
    }

    const alignment = mapAlignment(
      payload.alignment ?? payload.normalized_alignment,
    );

    const audio = Buffer.from(payload.audio_base64, "base64");
    return {
      audio,
      durationMs: getAlignmentDuration(alignment) ?? measureMp3DurationMs(audio),
      alignment,
    };
  }
}

/** Convertit l’alignement ElevenLabs en segments temporels utilisables par la voix off. */
function mapAlignment(
  alignment: ElevenLabsAlignment | undefined,
): VoiceOverAlignment | null {
  if (
    !alignment?.chars ||
    !alignment.char_start_times_ms ||
    !alignment.char_durations_ms ||
    alignment.chars.length !== alignment.char_start_times_ms.length ||
    alignment.chars.length !== alignment.char_durations_ms.length
  ) {
    return null;
  }

  return {
    source: "provider",
    characters: alignment.chars.map((character, index) => ({
      character,
      startMs: alignment.char_start_times_ms?.[index] ?? 0,
      durationMs: alignment.char_durations_ms?.[index] ?? 0,
    })),
  };
}

/** Retourne la durée couverte par l’alignement en prenant le dernier horodatage disponible. */
function getAlignmentDuration(
  alignment: VoiceOverAlignment | null,
): number | null {
  if (!alignment || alignment.characters.length === 0) {
    return null;
  }

  return Math.max(
    ...alignment.characters.map(
      (character) => character.startMs + character.durationMs,
    ),
  );
}
