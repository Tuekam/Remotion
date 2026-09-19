import type { ValidationReport } from "../models/ValidationReport.js";

/** Contrat des données ValidateVideoProjectUseCase utilisé dans le domaine vidéo. */
export interface ValidateVideoProjectUseCase {
  execute(videoId: string): Promise<ValidationReport>;
}
