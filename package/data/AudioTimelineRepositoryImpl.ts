import type { AudioTimeline } from "../../core/models/AudioTimeline.js";
import type { AudioTimelineRepository } from "../../core/repository/AudioTimelineRepository.js";
import { LocalVideoProjectStore } from "./database/LocalVideoProjectStore.js";

/** Orchestre les opérations du composant AudioTimelineRepositoryImpl dans le flux applicatif. */
export class AudioTimelineRepositoryImpl implements AudioTimelineRepository {
/** Initialise l’instance avec les dépendances injectées nécessaires à son rôle. */
  public constructor(
    private readonly localVideoProjectStore: LocalVideoProjectStore,
  ) {}

/** Crée et persiste la ressource métier correspondant aux données reçues. */
  public create(timeline: AudioTimeline): Promise<AudioTimeline> {
    return this.localVideoProjectStore.createAudioTimeline(timeline);
  }

/** Récupère la ressource demandée et signale son absence selon le contrat du service. */
  public getByVideoId(videoId: string): Promise<AudioTimeline | null> {
    return this.localVideoProjectStore.getAudioTimeline(videoId);
  }

/** Met à jour la ressource métier existante à partir des données reçues. */
  public update(timeline: AudioTimeline): Promise<AudioTimeline> {
    return this.localVideoProjectStore.updateAudioTimeline(timeline);
  }
}
