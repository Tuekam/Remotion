import type { VideoPlan } from "../../core/models/VideoPlan.js";
import type { VideoPlanRepository } from "../../core/repository/VideoPlanRepository.js";
import type { GetVideoPlanUseCase } from "../../core/use-case/GetVideoPlanUseCase.js";

export class GetVideoPlanUseCaseImpl implements GetVideoPlanUseCase {
  public constructor(
    private readonly videoPlanRepository: VideoPlanRepository,
  ) {}

  public async execute(videoId: string): Promise<VideoPlan> {
    const plan = await this.videoPlanRepository.getByVideoId(videoId);
    if (!plan) {
      throw new Error(`Video plan not found: ${videoId}`);
    }
    return plan;
  }
}
