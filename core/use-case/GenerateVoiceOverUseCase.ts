import type { VoiceOver } from "../models/VoiceOver.js";

export interface GenerateVoiceOverRequest {
  videoId: string;
  script: string;
  voiceId: string;
  language: string;
  model?: string;
  outputFormat?: string;
  voiceSettings?: {
    stability?: number;
    similarityBoost?: number;
    style?: number;
    useSpeakerBoost?: boolean;
    speed?: number;
  };
}

export interface GenerateVoiceOverUseCase {
  execute(input: GenerateVoiceOverRequest): Promise<VoiceOver>;
}
