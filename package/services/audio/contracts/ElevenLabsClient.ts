import type { VoiceOverAlignment } from "../../../../core/models/VoiceOver.js";

/** Contrat des données ElevenLabsSynthesisRequest utilisé dans le domaine vidéo. */
export interface ElevenLabsSynthesisRequest {
  voiceId: string;
  text: string;
  modelId?: string;
  languageCode?: string;
  outputFormat?: string;
  voiceSettings?: {
    stability?: number;
    similarityBoost?: number;
    style?: number;
    useSpeakerBoost?: boolean;
    speed?: number;
  };
}

/** Contrat des données ElevenLabsSynthesisResult utilisé dans le domaine vidéo. */
export interface ElevenLabsSynthesisResult {
  audio: Buffer;
  durationMs: number | null;
  alignment: VoiceOverAlignment | null;
}

/** Contrat des données ElevenLabsTranscriptionWord utilisé dans le domaine vidéo. */
export interface ElevenLabsTranscriptionWord {
  text: string;
  startMs: number;
  endMs: number;
}

/** Contrat des données ElevenLabsTranscriptionResult utilisé dans le domaine vidéo. */
export interface ElevenLabsTranscriptionResult {
  words: ElevenLabsTranscriptionWord[];
}

/** Contrat des données ElevenLabsClient utilisé dans le domaine vidéo. */
export interface ElevenLabsClient {
  synthesize(
    request: ElevenLabsSynthesisRequest,
  ): Promise<ElevenLabsSynthesisResult>;
  transcribe(
    audio: Buffer,
    languageCode?: string,
  ): Promise<ElevenLabsTranscriptionResult>;
}
