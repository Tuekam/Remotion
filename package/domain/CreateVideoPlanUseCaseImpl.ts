import type { VideoPlan } from "../../core/models/VideoPlan.js";
import type { AssetManifestRepository } from "../../core/repository/AssetManifestRepository.js";
import type { VideoBriefRepository } from "../../core/repository/VideoBriefRepository.js";
import type { VideoPlanRepository } from "../../core/repository/VideoPlanRepository.js";
import type { CreateVideoPlanUseCase } from "../../core/use-case/CreateVideoPlanUseCase.js";
import { VideoPlanningService } from "../services/video-planning/VideoPlanningService.js";
import { VideoTypeCatalog } from "../services/video-type/VideoTypeCatalog.js";

export class CreateVideoPlanUseCaseImpl implements CreateVideoPlanUseCase {
  public constructor(
    private readonly videoBriefRepository: VideoBriefRepository,
    private readonly assetManifestRepository: AssetManifestRepository,
    private readonly videoPlanRepository: VideoPlanRepository,
    private readonly videoTypeCatalog: VideoTypeCatalog,
    private readonly videoPlanningService: VideoPlanningService,
  ) {}

  public async execute(videoId: string): Promise<VideoPlan> {
    const brief = await this.videoBriefRepository.getByVideoId(videoId);
    const manifest = await this.assetManifestRepository.getByVideoId(videoId);
    if (!brief || !manifest || !brief.type) {
      throw new Error(`Video project is incomplete: ${videoId}`);
    }
    const plan = this.videoPlanningService.create(
      brief,
      manifest,
      this.videoTypeCatalog.get(brief.type),
    );
    const existing = await this.videoPlanRepository.getByVideoId(videoId);
    return existing
      ? this.videoPlanRepository.update({...plan, id: existing.id})
      : this.videoPlanRepository.create(plan);
  }
}
