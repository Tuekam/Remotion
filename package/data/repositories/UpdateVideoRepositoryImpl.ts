import type { UpdateVideoInput, Video } from "../../../core/models/Video.js";
import type { UpdateVideoRepository } from "../../../core/repository/UpdateVideoRepository.js";
import { LocalVideoStore } from "../database/LocalVideoStore.js";

export class UpdateVideoRepositoryImpl implements UpdateVideoRepository {
  public constructor(private readonly localVideoStore: LocalVideoStore) {}

  public update(
    id: string,
    input: UpdateVideoInput,
  ): Promise<Video | null> {
    return this.localVideoStore.update(id, input);
  }
}
