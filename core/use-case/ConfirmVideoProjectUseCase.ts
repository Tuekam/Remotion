import type { VideoBrief } from "../models/VideoBrief.js";

/** Contrat des données ConfirmVideoProjectUseCase utilisé dans le domaine vidéo. */
export interface ConfirmVideoProjectUseCase {
  execute(videoId: string): Promise<VideoBrief>;
}
