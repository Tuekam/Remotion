import type { VideoTypeDefinition } from "../models/VideoType.js";

export interface ListVideoTypesUseCase {
  execute(): Promise<readonly VideoTypeDefinition[]>;
}
