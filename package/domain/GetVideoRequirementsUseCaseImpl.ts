import type {
  VideoTypeDefinition,
  VideoTypeId,
} from "../../core/models/VideoType.js";
import type { GetVideoRequirementsUseCase } from "../../core/use-case/GetVideoRequirementsUseCase.js";
import { VideoTypeCatalog } from "../services/video-type/VideoTypeCatalog.js";

export class GetVideoRequirementsUseCaseImpl
  implements GetVideoRequirementsUseCase
{
  public constructor(private readonly videoTypeCatalog: VideoTypeCatalog) {}

  public async execute(videoType: VideoTypeId): Promise<VideoTypeDefinition> {
    return this.videoTypeCatalog.get(videoType);
  }
}
