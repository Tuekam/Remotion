import type { Asset } from "./Asset.js";

export interface AssetManifest {
  videoId: string;
  assets: Asset[];
  updatedAt: Date;
}
