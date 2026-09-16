export type ValidationStatus = "ready" | "incomplete";

export interface ValidationReport {
  status: ValidationStatus;
  canGenerate: boolean;
  missingRequiredInformation: string[];
  missingRequiredAssets: string[];
  missingRecommendedInformation: string[];
  missingRecommendedAssets: string[];
  warnings: string[];
}
