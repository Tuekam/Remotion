import type { AssetManifest } from "../models/AssetManifest.js";

export interface AssetManifestRepository {
  create(manifest: AssetManifest): Promise<AssetManifest>;
  getByVideoId(videoId: string): Promise<AssetManifest | null>;
  update(manifest: AssetManifest): Promise<AssetManifest>;
}
