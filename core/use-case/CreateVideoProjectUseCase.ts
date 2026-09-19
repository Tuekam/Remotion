import type { VideoBrief } from "../models/VideoBrief.js";

/** Contrat des données CreateVideoProjectInput utilisé dans le domaine vidéo. */
export interface CreateVideoProjectInput {
  videoId: string;
}

/** Contrat des données CreateVideoProjectUseCase utilisé dans le domaine vidéo. */
export interface CreateVideoProjectUseCase {
  execute(input: CreateVideoProjectInput): Promise<VideoBrief>;
}
