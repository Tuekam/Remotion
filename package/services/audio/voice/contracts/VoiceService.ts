import type { VoiceOver } from "../../../../../core/models/VoiceOver.js";

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

export interface VoiceService {
  generate(request: GenerateVoiceOverRequest): Promise<VoiceOver>;
}
