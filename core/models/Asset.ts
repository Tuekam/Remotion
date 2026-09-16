import type { AssetKey } from "./VideoType.js";

export type AssetType = "image" | "video" | "audio" | "document";

export interface AssetDimensions {
  width: number;
  height: number;
}

export interface Asset {
  id: string;
  videoId: string;
  name: string;
  key: AssetKey | null;
  type: AssetType;
  relativePath: string;
  mimeType: string;
  sizeInBytes: number;
  dimensions: AssetDimensions | null;
  durationInSeconds: number | null;
  createdAt: Date;
  updatedAt: Date;
}
