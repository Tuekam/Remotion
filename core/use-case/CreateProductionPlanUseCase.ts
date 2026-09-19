import type { ProductionPlan } from "../models/ProductionPlan.js";
import type { Music } from "../models/Music.js";
import type { VideoPlan } from "../models/VideoPlan.js";
import type { VoiceOver } from "../models/VoiceOver.js";

export interface CreateProductionPlanRequest {
  videoId: string;
  videoPlan: VideoPlan;
  voiceOver: VoiceOver;
  musicTracks?: Music[];
  fps: number;
  durationTargetMs?: number;
}

export interface CreateProductionPlanUseCase {
  execute(input: CreateProductionPlanRequest): Promise<ProductionPlan>;
}
