import type { Render } from "../../core/models/Render.js";
import type { VideoBriefRepository } from "../../core/repository/VideoBriefRepository.js";
import type { ProductionPlanRepository } from "../../core/repository/ProductionPlanRepository.js";
import type {
  GenerateVideoProjectInput,
  GenerateVideoProjectUseCase,
} from "../../core/use-case/GenerateVideoProjectUseCase.js";
import type { GenerateVideoInput } from "../../core/use-case/GenerateVideoUseCase.js";
import type { GenerateVideoUseCase } from "../../core/use-case/GenerateVideoUseCase.js";

export class GenerateVideoProjectUseCaseImpl
  implements GenerateVideoProjectUseCase
{
  public constructor(
    private readonly videoBriefRepository: VideoBriefRepository,
    private readonly productionPlanRepository: ProductionPlanRepository,
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
    const productionPlan = await this.productionPlanRepository.getByVideoId(
      input.videoId,
    );
    if (
      productionPlan &&
      productionPlan.status !== "ready-for-render" &&
      productionPlan.status !== "rendered" &&
      productionPlan.status !== "completed"
    ) {
      throw new Error("Audio production plan is not ready for rendering");
    }

    const generationInput: GenerateVideoInput = {
      ...input,
    };
    if (productionPlan) {
      generationInput.inputProps = { productionPlan };
    }
    return this.generateVideoUseCase.execute(generationInput);
  }
}
