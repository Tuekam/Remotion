import type { VideoBrief } from "../models/VideoBrief.js";

/** Contrat des données VideoBriefRepository utilisé dans le domaine vidéo. */
export interface VideoBriefRepository {
  create(brief: VideoBrief): Promise<VideoBrief>;
  getByVideoId(videoId: string): Promise<VideoBrief | null>;
  update(brief: VideoBrief): Promise<VideoBrief>;
}
