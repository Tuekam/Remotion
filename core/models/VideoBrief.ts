export type VideoBriefStatus =
  | "incomplete"
  | "ready-for-confirmation"
  | "ready-for-generation";

/** Contrat des données VideoBrief utilisé dans le domaine vidéo. */
export interface VideoBrief {
  id: string;
  prompt: string | null;
  assetIds: string[];
  status: VideoBriefStatus;
  createdAt: Date;
  updatedAt: Date;
}
