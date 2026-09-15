import type { Video } from "../../../core/models/Video.js";
import type { GetVideoRepository } from "../../../core/repository/GetVideoRepository.js";
import { LocalVideoStore } from "../database/LocalVideoStore.js";

export class GetVideoRepositoryImpl implements GetVideoRepository {
  public constructor(private readonly localVideoStore: LocalVideoStore) {}

  public getById(id: string): Promise<Video | null> {
    return this.localVideoStore.getById(id);
  }
}
