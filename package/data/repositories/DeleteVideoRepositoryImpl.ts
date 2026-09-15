import type { DeleteVideoRepository } from "../../../core/repository/DeleteVideoRepository.js";
import { LocalVideoStore } from "../database/LocalVideoStore.js";

export class DeleteVideoRepositoryImpl implements DeleteVideoRepository {
  public constructor(private readonly localVideoStore: LocalVideoStore) {}

  public delete(id: string): Promise<boolean> {
    return this.localVideoStore.delete(id);
  }
}
