import { randomUUID } from "node:crypto";
import type { AssetManifest } from "../../core/models/AssetManifest.js";
import type { VideoBrief } from "../../core/models/VideoBrief.js";
import type { AssetManifestRepository } from "../../core/repository/AssetManifestRepository.js";
import type { VideoBriefRepository } from "../../core/repository/VideoBriefRepository.js";
import type {
  CreateVideoProjectInput,
  CreateVideoProjectUseCase,
} from "../../core/use-case/CreateVideoProjectUseCase.js";
import type { WorkspaceManager } from "../../core/service/WorkspaceManager.js";

/** Orchestre les opérations du composant CreateVideoProjectUseCaseImpl dans le flux applicatif. */
export class CreateVideoProjectUseCaseImpl
  implements CreateVideoProjectUseCase
{
/** Initialise l’instance avec les dépendances injectées nécessaires à son rôle. */
  public constructor(
    private readonly workspaceManager: WorkspaceManager,
    private readonly videoBriefRepository: VideoBriefRepository,
    private readonly assetManifestRepository: AssetManifestRepository,
  ) {}

/** Exécute le cas d’usage avec les données reçues et retourne son résultat. */
  public async execute(input: CreateVideoProjectInput): Promise<VideoBrief> {
    if (input.videoId.trim().length === 0) {
      throw new Error("Video id is required");
    }

    await this.workspaceManager.create(input.videoId);
    const now = new Date();
    const brief: VideoBrief = {
      id: input.videoId,
      prompt: null,
      assetIds: [],
      status: "incomplete",
      createdAt: now,
      updatedAt: now,
    };
    const manifest: AssetManifest = {
      videoId: input.videoId,
      assets: [],
      updatedAt: now,
    };

    await this.videoBriefRepository.create(brief);
    await this.assetManifestRepository.create(manifest);
    return brief;
  }
}
