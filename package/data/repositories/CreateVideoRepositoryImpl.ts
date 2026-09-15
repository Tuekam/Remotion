import type { CreateVideoInput, Video } from "../../../core/models/Video.js";
import type { CreateVideoRepository } from "../../../core/repository/CreateVideoRepository.js";
import { LocalVideoStore } from "../database/LocalVideoStore.js";

export class CreateVideoRepositoryImpl implements CreateVideoRepository {
  public constructor(private readonly localVideoStore: LocalVideoStore) {}

  public create(input: CreateVideoInput): Promise<Video> {
    return this.localVideoStore.create(input);
  }
}
