import type { Render } from "../../../core/models/Render.js";
import type {
  GenerateVideoInput,
  GenerateVideoService,
} from "../../../core/use-case/GenerateVideoUseCase.js";
import type { VideoEngine } from "./contracts/VideoEngine.js";

export class GenerateVideoServiceImpl implements GenerateVideoService {
  public constructor(private readonly videoEngine: VideoEngine) {}

  public generate(input: GenerateVideoInput): Promise<Render> {
    return this.videoEngine.render(input);
  }
}
