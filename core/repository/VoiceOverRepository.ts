import type { VoiceOver } from "../models/VoiceOver.js";

/** Contrat des données VoiceOverRepository utilisé dans le domaine vidéo. */
export interface VoiceOverRepository {
  create(voiceOver: VoiceOver): Promise<VoiceOver>;
  getByVideoId(videoId: string): Promise<VoiceOver | null>;
  update(voiceOver: VoiceOver): Promise<VoiceOver>;
}
