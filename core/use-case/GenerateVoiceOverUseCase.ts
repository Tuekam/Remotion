import type { VoiceOver } from "../models/VoiceOver.js";

/** Contrat des données GenerateVoiceOverRequest utilisé dans le domaine vidéo. */
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

/** Contrat des données GenerateVoiceOverUseCase utilisé dans le domaine vidéo. */
export interface GenerateVoiceOverUseCase {
  execute(input: GenerateVoiceOverRequest): Promise<VoiceOver>;
}
