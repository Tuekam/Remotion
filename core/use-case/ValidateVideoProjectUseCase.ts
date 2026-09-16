import type { ValidationReport } from "../models/ValidationReport.js";

export interface ValidateVideoProjectUseCase {
  execute(videoId: string): Promise<ValidationReport>;
}
