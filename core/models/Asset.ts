export type AssetKey =
  | "productVisual"
  | "productDemo"
  | "logo"
  | "promotionalVisual"
  | "serviceVisual"
  | "companyVisual"
  | "testimonial"
  | "clientPhoto"
  | "proof"
  | "eventPoster"
  | "speakerVisual"
  | "program";

export type AssetType = "image" | "video" | "audio" | "document";

/** Contrat des données AssetDimensions utilisé dans le domaine vidéo. */
export interface AssetDimensions {
  width: number;
  height: number;
}

/** Contrat des données Asset utilisé dans le domaine vidéo. */
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
