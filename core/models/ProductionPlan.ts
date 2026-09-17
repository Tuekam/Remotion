import type { AudioTimeline } from "./AudioTimeline.js";
import type { VideoPlan } from "./VideoPlan.js";

export type ProductionPlanStatus =
  | "audio-pending"
  | "audio-ready"
  | "ready-for-render"
  | "rendered"
  | "verification-failed"
  | "completed";

export interface ProductionPlan {
  id: string;
  videoId: string;
  videoPlan: VideoPlan;
  voicePlan: string;
  musicPlan: string;
  audioTimeline: AudioTimeline;
  finalDurationMs: number;
  status: ProductionPlanStatus;
  createdAt: Date;
  updatedAt: Date;
}
