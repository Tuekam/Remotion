import type { ValidationReport } from "../../core/models/ValidationReport.js";
import type { AssetManifestRepository } from "../../core/repository/AssetManifestRepository.js";
import type { VideoBriefRepository } from "../../core/repository/VideoBriefRepository.js";
import type { ValidateVideoProjectUseCase } from "../../core/use-case/ValidateVideoProjectUseCase.js";

/** Vérifie qu'un projet possède un prompt exploitable avant sa confirmation. */
export class ValidateVideoProjectUseCaseImpl
  implements ValidateVideoProjectUseCase
{
  public constructor(
    private readonly videoBriefRepository: VideoBriefRepository,
    private readonly assetManifestRepository: AssetManifestRepository,
  ) {}

  /** Charge le brief et le manifeste, puis signale les éléments qui empêchent la génération. */
  public async execute(videoId: string): Promise<ValidationReport> {
    const brief = await this.videoBriefRepository.getByVideoId(videoId);
    const manifest = await this.assetManifestRepository.getByVideoId(videoId);
    if (!brief || !manifest) {
      throw new Error(`Video project not found: ${videoId}`);
    }
    const hasPrompt =
      typeof brief.prompt === "string" && brief.prompt.trim().length > 0;
    const missingRequiredInformation = hasPrompt ? [] : ["prompt"];

    return {
      status: hasPrompt ? "ready" : "incomplete",
      canGenerate: hasPrompt,
      missingRequiredInformation,
      missingRequiredAssets: [],
      missingRecommendedInformation: [],
      missingRecommendedAssets: [],
      warnings:
        manifest.assets.length === 0
          ? ["Aucun asset utilisateur n'a été fourni"]
          : [],
    };
  }
}
