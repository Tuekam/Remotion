import type { VideoBrief } from "../../core/models/VideoBrief.js";
import type {
  UpdateVideoBriefInput,
  UpdateVideoBriefUseCase,
} from "../../core/use-case/UpdateVideoBriefUseCase.js";
import type { VideoBriefRepository } from "../../core/repository/VideoBriefRepository.js";

/** Orchestre les opérations du composant UpdateVideoBriefUseCaseImpl dans le flux applicatif. */
export class UpdateVideoBriefUseCaseImpl implements UpdateVideoBriefUseCase {
/** Initialise l’instance avec les dépendances injectées nécessaires à son rôle. */
  public constructor(
    private readonly videoBriefRepository: VideoBriefRepository,
  ) {}

/** Exécute le cas d’usage avec les données reçues et retourne son résultat. */
  public async execute(
    videoId: string,
    input: UpdateVideoBriefInput,
  ): Promise<VideoBrief> {
    const current = await this.videoBriefRepository.getByVideoId(videoId);
    if (!current) {
      throw new Error(`Video brief not found: ${videoId}`);
    }

    const updated: VideoBrief = {
      ...current,
      prompt: input.prompt === undefined ? current.prompt : input.prompt,
      status: input.status === undefined ? current.status : input.status,
      updatedAt: new Date(),
    };
    return this.videoBriefRepository.update(updated);
  }
}
