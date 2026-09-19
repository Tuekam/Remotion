import type { Render } from "../models/Render.js";

/** Contrat des données GenerateVideoProjectInput utilisé dans le domaine vidéo. */
export interface GenerateVideoProjectInput {
  videoId: string;
  compositionId: string;
  outputPath: string;
}

/** Contrat des données GenerateVideoProjectUseCase utilisé dans le domaine vidéo. */
export interface GenerateVideoProjectUseCase {
  execute(input: GenerateVideoProjectInput): Promise<Render>;
}
