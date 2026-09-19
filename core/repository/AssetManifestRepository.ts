import type { AssetManifest } from "../models/AssetManifest.js";

/** Contrat des données AssetManifestRepository utilisé dans le domaine vidéo. */
export interface AssetManifestRepository {
  create(manifest: AssetManifest): Promise<AssetManifest>;
  getByVideoId(videoId: string): Promise<AssetManifest | null>;
  update(manifest: AssetManifest): Promise<AssetManifest>;
}
