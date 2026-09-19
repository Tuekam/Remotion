import type { VideoBrief } from "../../core/models/VideoBrief.js";
import type { ConfirmVideoProjectUseCase } from "../../core/use-case/ConfirmVideoProjectUseCase.js";
import type { VideoBriefRepository } from "../../core/repository/VideoBriefRepository.js";
import type { ValidateVideoProjectUseCase } from "../../core/use-case/ValidateVideoProjectUseCase.js";

/** Orchestre les opérations du composant ConfirmVideoProjectUseCaseImpl dans le flux applicatif. */
export class ConfirmVideoProjectUseCaseImpl
  implements ConfirmVideoProjectUseCase
{
/** Initialise l’instance avec les dépendances injectées nécessaires à son rôle. */
  public constructor(
    private readonly videoBriefRepository: VideoBriefRepository,
    private readonly validateVideoProjectUseCase: ValidateVideoProjectUseCase,
  ) {}

/** Exécute le cas d’usage avec les données reçues et retourne son résultat. */
  public async execute(videoId: string): Promise<VideoBrief> {
    const brief = await this.videoBriefRepository.getByVideoId(videoId);
    if (!brief) {
      throw new Error(`Video brief not found: ${videoId}`);
    }
    const report = await this.validateVideoProjectUseCase.execute(videoId);
    if (
      report.missingRequiredInformation.length > 0 ||
      report.missingRequiredAssets.length > 0
    ) {
      throw new Error("Video project is missing required information or assets");
    }

    return this.videoBriefRepository.update({
      ...brief,
      status: "ready-for-generation",
      updatedAt: new Date(),
    });
  }
}
