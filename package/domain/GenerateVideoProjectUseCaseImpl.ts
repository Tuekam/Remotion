import type { Render } from "../../core/models/Render.js";
import type { VideoBriefRepository } from "../../core/repository/VideoBriefRepository.js";
import type {
  GenerateVideoProjectInput,
  GenerateVideoProjectUseCase,
} from "../../core/use-case/GenerateVideoProjectUseCase.js";
import type { GenerateVideoUseCase } from "../../core/use-case/GenerateVideoUseCase.js";

export class GenerateVideoProjectUseCaseImpl
  implements GenerateVideoProjectUseCase
{
  public constructor(
    private readonly videoBriefRepository: VideoBriefRepository,
    private readonly generateVideoUseCase: GenerateVideoUseCase,
  ) {}

  public async execute(input: GenerateVideoProjectInput): Promise<Render> {
    const brief = await this.videoBriefRepository.getByVideoId(input.videoId);
    if (!brief) {
      throw new Error(`Video brief not found: ${input.videoId}`);
    }
    if (brief.status !== "ready-for-generation") {
      throw new Error("Video project is not confirmed for production");
    }

    return this.generateVideoUseCase.execute(input);
  }
}
