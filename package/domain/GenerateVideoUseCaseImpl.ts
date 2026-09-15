import type { Render } from "../../core/models/Render.js";
import type {
  GenerateVideoInput,
  GenerateVideoService,
  GenerateVideoUseCase,
} from "../../core/use-case/GenerateVideoUseCase.js";

export class GenerateVideoUseCaseImpl implements GenerateVideoUseCase {
  public constructor(
    private readonly generateVideoService: GenerateVideoService,
  ) {}

  public execute(input: GenerateVideoInput): Promise<Render> {
    return this.generateVideoService.generate(input);
  }
}
