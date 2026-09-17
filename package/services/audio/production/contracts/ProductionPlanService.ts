import type { Music } from "../../../../../core/models/Music.js";
import type { ProductionPlan } from "../../../../../core/models/ProductionPlan.js";
import type { VideoPlan } from "../../../../../core/models/VideoPlan.js";
import type { VoiceOver } from "../../../../../core/models/VoiceOver.js";

export interface CreateProductionPlanRequest {
  videoId: string;
  videoPlan: VideoPlan;
  voiceOver: VoiceOver;
  musicTracks?: Music[];
  fps: number;
  durationTargetMs?: number;
}

export interface ProductionPlanService {
  create(request: CreateProductionPlanRequest): Promise<ProductionPlan>;
}
