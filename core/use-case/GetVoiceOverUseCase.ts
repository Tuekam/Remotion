import type { VoiceOver } from "../models/VoiceOver.js";

/** Contrat des données GetVoiceOverUseCase utilisé dans le domaine vidéo. */
export interface GetVoiceOverUseCase {
  execute(videoId: string): Promise<VoiceOver>;
}
