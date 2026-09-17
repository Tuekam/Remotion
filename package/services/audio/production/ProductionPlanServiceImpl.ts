import { randomUUID } from "node:crypto";
import type { ProductionPlan } from "../../../../core/models/ProductionPlan.js";
import type { ProductionPlanRepository } from "../../../../core/repository/ProductionPlanRepository.js";
import type {
  AudioTimelineService,
  CreateAudioTimelineRequest,
} from "../timeline/contracts/AudioTimelineService.js";
import type {
  CreateProductionPlanRequest,
  ProductionPlanService,
} from "./contracts/ProductionPlanService.js";

export class ProductionPlanServiceImpl implements ProductionPlanService {
  public constructor(
    private readonly productionPlanRepository: ProductionPlanRepository,
    private readonly audioTimelineService: AudioTimelineService,
  ) {}

  public async create(
    request: CreateProductionPlanRequest,
  ): Promise<ProductionPlan> {
    validateRequest(request);
    const existing = await this.productionPlanRepository.getByVideoId(
      request.videoId,
    );
    const timelineRequest: CreateAudioTimelineRequest = {
      videoId: request.videoId,
      voiceOver: request.voiceOver,
      fps: request.fps,
    };
    if (request.musicTracks) {
      timelineRequest.musicTracks = request.musicTracks;
    }
    if (request.durationTargetMs !== undefined) {
      timelineRequest.durationTargetMs = request.durationTargetMs;
    }
    const { timeline } = this.audioTimelineService.create(timelineRequest);
    const now = new Date();
    const plan: ProductionPlan = {
      id: existing?.id ?? randomUUID(),
      videoId: request.videoId,
      videoPlan: request.videoPlan,
      voicePlan: buildVoicePlan(request.voiceOver),
      musicPlan: buildMusicPlan(request.musicTracks ?? []),
      audioTimeline: timeline,
      finalDurationMs: timeline.durationMs,
      status: "ready-for-render",
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };

    return existing
      ? this.productionPlanRepository.update(plan)
      : this.productionPlanRepository.create(plan);
  }
}

function validateRequest(request: CreateProductionPlanRequest): void {
  if (request.videoId.trim().length === 0) {
    throw new Error("Video ID must not be empty");
  }
  if (request.videoPlan.videoId !== request.videoId) {
    throw new Error("Video plan must belong to the current video");
  }
  if (request.voiceOver.videoId !== request.videoId) {
    throw new Error("Voice-over must belong to the current video");
  }
  for (const track of request.musicTracks ?? []) {
    if (track.videoId !== request.videoId) {
      throw new Error("Music track must belong to the current video");
    }
  }
}

function buildVoicePlan(voiceOver: CreateProductionPlanRequest["voiceOver"]): string {
  return `Narration ${voiceOver.language}, voix ${voiceOver.voiceId}, durée réelle ${
    voiceOver.durationMs ?? 0
  } ms.`;
}

function buildMusicPlan(
  musicTracks: CreateProductionPlanRequest["musicTracks"],
): string {
  if (!musicTracks || musicTracks.length === 0) {
    return "Aucune musique locale sélectionnée.";
  }
  return musicTracks
    .map(
      (track) =>
        `${track.path}, volume ${track.volume}, boucle ${track.loop ? "activée" : "désactivée"}, ducking ${
          track.ducking.enabled ? "activé" : "désactivé"
        }.`,
    )
    .join(" ");
}
