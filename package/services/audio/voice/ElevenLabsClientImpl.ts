import type {
  ElevenLabsClient,
  ElevenLabsSynthesisRequest,
  ElevenLabsSynthesisResult,
  ElevenLabsTranscriptionResult,
} from "./contracts/ElevenLabsClient.js";
import type { VoiceOverAlignment } from "../../../../core/models/VoiceOver.js";

const MAX_TTS_ATTEMPTS = 3;

interface ElevenLabsResponse {
  audio_base64?: string;
  alignment?: ElevenLabsAlignment;
  normalized_alignment?: ElevenLabsAlignment;
}

interface ElevenLabsTranscriptionResponse {
  words?: Array<{
    text?: string;
    start?: number;
    end?: number;
    type?: string;
  }>;
}

interface ElevenLabsAlignment {
  chars?: string[];
  char_start_times_ms?: number[];
  char_durations_ms?: number[];
}

export class ElevenLabsClientImpl implements ElevenLabsClient {
  public constructor(
    private readonly elevenLabsApiKey: string | undefined,
    private readonly elevenLabsApiBaseUrl = "https://api.elevenlabs.io",
    private readonly fetcher: typeof fetch = fetch,
  ) {}

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

    const payload = (await response.json()) as ElevenLabsTranscriptionResponse;
    const words = (payload.words ?? []).flatMap((word) => {
      const start = word.start;
      const end = word.end;
      const validStart =
        typeof start === "number" && Number.isFinite(start) ? start : null;
      const validEnd =
        typeof end === "number" && Number.isFinite(end) ? end : null;
      if (
        word.type !== "word" ||
        typeof word.text !== "string" ||
        validStart === null ||
        validEnd === null ||
        validEnd < validStart
      ) {
        return [];
      }
      return [
        {
          text: word.text,
          startMs: Math.round(validStart * 1000),
          endMs: Math.round(validEnd * 1000),
        },
      ];
    });

    return { words };
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

export function measureMp3DurationMs(audio: Buffer): number | null {
  let offset = 0;
  if (audio.length >= 10 && audio.toString("ascii", 0, 3) === "ID3") {
    offset = 10 + syncSafeInteger(audio, 6);
  }

  let durationMs = 0;
  let frameCount = 0;
  while (offset + 4 <= audio.length) {
    const frame = readMp3Frame(audio, offset);
    if (!frame) {
      offset += 1;
      continue;
    }
    durationMs += (frame.samplesPerFrame / frame.sampleRate) * 1000;
    frameCount += 1;
    offset += frame.frameLength;
  }

  return frameCount > 0 ? Math.round(durationMs) : null;
}

function readMp3Frame(
  audio: Buffer,
  offset: number,
): { frameLength: number; samplesPerFrame: number; sampleRate: number } | null {
  const header = audio.readUInt32BE(offset);
  if (((header & 0xffe00000) >>> 0) !== 0xffe00000) {
    return null;
  }

  const versionBits = (header >> 19) & 0b11;
  const layerBits = (header >> 17) & 0b11;
  const bitrateIndex = (header >> 12) & 0b1111;
  const sampleRateIndex = (header >> 10) & 0b11;
  const padding = (header >> 9) & 0b1;
  if (
    versionBits === 0b01 ||
    layerBits !== 0b01 ||
    bitrateIndex === 0 ||
    bitrateIndex === 0b1111 ||
    sampleRateIndex === 0b11
  ) {
    return null;
  }

  const version = versionBits === 0b11 ? "mpeg1" : "mpeg2";
  const sampleRates =
    version === "mpeg1"
      ? [44100, 48000, 32000]
      : versionBits === 0b10
        ? [22050, 24000, 16000]
        : [11025, 12000, 8000];
  const sampleRate = sampleRates[sampleRateIndex];
  if (!sampleRate) {
    return null;
  }

  const bitrates =
    version === "mpeg1"
      ? [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320]
      : [0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160];
  const bitrate = bitrates[bitrateIndex];
  if (!bitrate) {
    return null;
  }

  const samplesPerFrame = version === "mpeg1" ? 1152 : 576;
  const frameLength =
    Math.floor((version === "mpeg1" ? 144 : 72) * (bitrate * 1000) / sampleRate) +
    padding;
  if (frameLength < 4 || offset + frameLength > audio.length) {
    return null;
  }

  return { frameLength, samplesPerFrame, sampleRate };
}

function syncSafeInteger(audio: Buffer, offset: number): number {
  return (
    ((audio[offset] ?? 0) & 0x7f) * 0x200000 +
    ((audio[offset + 1] ?? 0) & 0x7f) * 0x4000 +
    ((audio[offset + 2] ?? 0) & 0x7f) * 0x80 +
    ((audio[offset + 3] ?? 0) & 0x7f)
  );
}
