import type { AssetManifest } from "../../../core/models/AssetManifest.js";
import type { AssetManifestRepository } from "../../../core/repository/AssetManifestRepository.js";
import { LocalVideoProjectStore } from "../database/LocalVideoProjectStore.js";

export class AssetManifestRepositoryImpl implements AssetManifestRepository {
  public constructor(private readonly localVideoProjectStore: LocalVideoProjectStore) {}

  public create(manifest: AssetManifest): Promise<AssetManifest> {
    return this.localVideoProjectStore.createManifest(manifest);
  }

  public getByVideoId(videoId: string): Promise<AssetManifest | null> {
    return this.localVideoProjectStore.getManifest(videoId);
  }

  public update(manifest: AssetManifest): Promise<AssetManifest> {
    return this.localVideoProjectStore.updateManifest(manifest);
  }
}
