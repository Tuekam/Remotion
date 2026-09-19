export type RenderStatus = "pending" | "rendering" | "completed" | "failed";

/** Contrat des données Render utilisé dans le domaine vidéo. */
export interface Render {
  id: string;
  videoId: string;
  status: RenderStatus;
  outputPath: string | null;
  startedAt: Date | null;
  completedAt: Date | null;
  error: string | null;
}
