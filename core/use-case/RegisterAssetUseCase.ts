import type { Asset, AssetType } from "../models/Asset.js";
import type { AssetKey } from "../models/Asset.js";

/** Contrat des données RegisterAssetInput utilisé dans le domaine vidéo. */
export interface RegisterAssetInput {
  videoId: string;
  name: string;
  key?: AssetKey | null;
  type: AssetType;
  sourcePath?: string;
  sourceUrl?: string;
  contentBase64?: string;
}

/** Contrat des données RegisterAssetUseCase utilisé dans le domaine vidéo. */
export interface RegisterAssetUseCase {
  execute(input: RegisterAssetInput): Promise<Asset>;
}
