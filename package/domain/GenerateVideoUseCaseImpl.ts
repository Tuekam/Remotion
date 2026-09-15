import type { Render } from "../../core/models/Render.ts";
import type {
  GenerateVideoInput,
  GenerateVideoService,
  GenerateVideoUseCase,
} from "../../core/use-case/GenerateVideoUseCase.ts";

export class GenerateVideoUseCaseImpl implements GenerateVideoUseCase {
  public constructor(
    private readonly generateVideoService: GenerateVideoService,
  ) {}

  public execute(input: GenerateVideoInput): Promise<Render> {
    return this.generateVideoService.generate(input);
  }
}
