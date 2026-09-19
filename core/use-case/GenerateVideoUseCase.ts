import type { Render } from "../models/Render.js";

/** Contrat des données GenerateVideoInput utilisé dans le domaine vidéo. */
export interface GenerateVideoInput {
  videoId: string;
  compositionId: string;
  outputPath: string;
  inputProps?: Record<string, unknown>;
}

/** Contrat des données GenerateVideoUseCase utilisé dans le domaine vidéo. */
export interface GenerateVideoUseCase {
  execute(input: GenerateVideoInput): Promise<Render>;
}