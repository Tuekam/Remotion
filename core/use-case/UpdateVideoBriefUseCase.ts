import type { VideoBrief, VideoBriefStatus } from "../models/VideoBrief.js";

/** Contrat des données UpdateVideoBriefInput utilisé dans le domaine vidéo. */
export interface UpdateVideoBriefInput {
  prompt?: string | null | undefined;
  status?: VideoBriefStatus | undefined;
}

/** Contrat des données UpdateVideoBriefUseCase utilisé dans le domaine vidéo. */
export interface UpdateVideoBriefUseCase {
  execute(videoId: string, input: UpdateVideoBriefInput): Promise<VideoBrief>;
}
