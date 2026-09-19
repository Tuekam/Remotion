export type ValidationStatus = "ready" | "incomplete";

/** Contrat des données ValidationReport utilisé dans le domaine vidéo. */
export interface ValidationReport {
  status: ValidationStatus;
  canGenerate: boolean;
  missingRequiredInformation: string[];
  missingRequiredAssets: string[];
  missingRecommendedInformation: string[];
  missingRecommendedAssets: string[];
  warnings: string[];
}
