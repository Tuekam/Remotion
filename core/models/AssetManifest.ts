import type { Asset } from "./Asset.js";

/** Contrat des données AssetManifest utilisé dans le domaine vidéo. */
export interface AssetManifest {
  videoId: string;
  assets: Asset[];
  updatedAt: Date;
}
