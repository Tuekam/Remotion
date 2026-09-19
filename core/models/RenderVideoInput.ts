/** Contrat des données RenderVideoInput utilisé dans le domaine vidéo. */
export interface RenderVideoInput {
  videoId: string;
  compositionId: string;
  outputPath: string;
  inputProps?: Record<string, unknown>;
}
