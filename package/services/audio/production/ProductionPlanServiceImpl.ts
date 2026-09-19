import { randomUUID } from "node:crypto";
import type { ProductionPlan } from "../../../../core/models/ProductionPlan.js";
import type { ProductionPlanRepository } from "../../../../core/repository/ProductionPlanRepository.js";
import { AudioTimelineServiceImpl } from "../timeline/AudioTimelineServiceImpl.js";
import type { CreateAudioTimelineRequest } from "../timeline/AudioTimelineServiceImpl.js";
import type { CreateProductionPlanRequest } from "../../../../core/use-case/CreateProductionPlanUseCase.js";

/** Orchestre les opérations du composant ProductionPlanServiceImpl dans le flux applicatif. */
export class ProductionPlanServiceImpl {
/** Initialise l’instance avec les dépendances injectées nécessaires à son rôle. */
  public constructor(
    private readonly productionPlanRepository: ProductionPlanRepository,
    private readonly audioTimelineService: AudioTimelineServiceImpl,
  ) {}

  /** Persiste un plan de production construit a partir des entrees video et audio validees. */
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

/** Valide les paramètres métier requis avant de lancer le traitement audio demandé. */
function validateRequest(request: CreateProductionPlanRequest): void {
  if (request.videoId.trim().length === 0) {
    throw new Error("Video ID must not be empty");
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

/** Construit la description de la piste voix à partir des segments de la voix off validée. */
function buildVoicePlan(voiceOver: CreateProductionPlanRequest["voiceOver"]): string {
  return `Narration ${voiceOver.language}, voix ${voiceOver.voiceId}, durée réelle ${
    voiceOver.durationMs ?? 0
  } ms.`;
}

/** Construit la description de la piste musicale et de son ducking pour le plan audio. */
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
