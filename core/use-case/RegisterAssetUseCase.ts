import type { Asset, AssetType } from "../models/Asset.js";
import type { AssetKey } from "../models/VideoType.js";

export interface RegisterAssetInput {
  videoId: string;
  name: string;
  key?: AssetKey | null;
  type: AssetType;
  sourcePath: string;
}

export interface RegisterAssetUseCase {
  execute(input: RegisterAssetInput): Promise<Asset>;
}
