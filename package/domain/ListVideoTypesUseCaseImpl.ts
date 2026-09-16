import type { VideoTypeDefinition } from "../../core/models/VideoType.js";
import type { ListVideoTypesUseCase } from "../../core/use-case/ListVideoTypesUseCase.js";
import { VideoTypeCatalog } from "../services/video-type/VideoTypeCatalog.js";

export class ListVideoTypesUseCaseImpl implements ListVideoTypesUseCase {
  public constructor(private readonly videoTypeCatalog: VideoTypeCatalog) {}

  public async execute(): Promise<readonly VideoTypeDefinition[]> {
    return this.videoTypeCatalog.list();
  }
}
