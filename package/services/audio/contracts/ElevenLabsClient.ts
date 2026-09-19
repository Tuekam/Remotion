import type { VoiceOverAlignment } from "../../../../core/models/VoiceOver.js";

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

export interface ElevenLabsSynthesisResult {
  audio: Buffer;
  durationMs: number | null;
  alignment: VoiceOverAlignment | null;
}

export interface ElevenLabsTranscriptionWord {
  text: string;
  startMs: number;
  endMs: number;
}

export interface ElevenLabsTranscriptionResult {
  words: ElevenLabsTranscriptionWord[];
}

export interface ElevenLabsClient {
  synthesize(
    request: ElevenLabsSynthesisRequest,
  ): Promise<ElevenLabsSynthesisResult>;
  transcribe?(
    audio: Buffer,
    languageCode?: string,
  ): Promise<ElevenLabsTranscriptionResult>;
}
