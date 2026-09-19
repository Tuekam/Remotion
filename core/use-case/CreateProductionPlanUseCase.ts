import type { ProductionPlan } from "../models/ProductionPlan.js";
import type { Music } from "../models/Music.js";
import type { VoiceOver } from "../models/VoiceOver.js";

/** Contrat des données CreateProductionPlanRequest utilisé dans le domaine vidéo. */
export interface CreateProductionPlanRequest {
  videoId: string;
  voiceOver: VoiceOver;
  musicTracks?: Music[];
  fps: number;
  durationTargetMs?: number;
}

/** Contrat des données CreateProductionPlanUseCase utilisé dans le domaine vidéo. */
export interface CreateProductionPlanUseCase {
  execute(input: CreateProductionPlanRequest): Promise<ProductionPlan>;
}
