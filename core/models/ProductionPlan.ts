import type { AudioTimeline } from "./AudioTimeline.js";

export type ProductionPlanStatus =
  | "audio-pending"
  | "audio-ready"
  | "ready-for-render"
  | "rendered"
  | "verification-failed"
  | "completed";

/** Contrat des données ProductionPlan utilisé dans le domaine vidéo. */
export interface ProductionPlan {
  id: string;
  videoId: string;
  voicePlan: string;
  musicPlan: string;
  audioTimeline: AudioTimeline;
  finalDurationMs: number;
  status: ProductionPlanStatus;
  createdAt: Date;
  updatedAt: Date;
}
