import type { ValidationReport } from "../../core/models/ValidationReport.js";
import type { AssetManifestRepository } from "../../core/repository/AssetManifestRepository.js";
import type { VideoBriefRepository } from "../../core/repository/VideoBriefRepository.js";
import type { ValidateVideoProjectUseCase } from "../../core/use-case/ValidateVideoProjectUseCase.js";
import { VideoTypeCatalog } from "../services/video-type/VideoTypeCatalog.js";
import { VideoValidationService } from "../services/validation/VideoValidationService.js";

export class ValidateVideoProjectUseCaseImpl
  implements ValidateVideoProjectUseCase
{
  public constructor(
    private readonly videoBriefRepository: VideoBriefRepository,
    private readonly assetManifestRepository: AssetManifestRepository,
    private readonly videoTypeCatalog: VideoTypeCatalog,
    private readonly videoValidationService: VideoValidationService,
  ) {}

  public async execute(videoId: string): Promise<ValidationReport> {
    const brief = await this.videoBriefRepository.getByVideoId(videoId);
    const manifest = await this.assetManifestRepository.getByVideoId(videoId);
    if (!brief || !manifest) {
      throw new Error(`Video project not found: ${videoId}`);
    }
    if (!brief.type) {
      return {
        status: "incomplete",
        canGenerate: false,
        missingRequiredInformation: ["type"],
        missingRequiredAssets: [],
        missingRecommendedInformation: [],
        missingRecommendedAssets: [],
        warnings: [],
      };
    }
    return this.videoValidationService.validate(
      brief,
      manifest,
      this.videoTypeCatalog.get(brief.type),
    );
  }
}
