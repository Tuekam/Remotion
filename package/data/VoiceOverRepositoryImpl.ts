import type { VoiceOver } from "../../core/models/VoiceOver.js";
import type { VoiceOverRepository } from "../../core/repository/VoiceOverRepository.js";
import { LocalVideoProjectStore } from "./database/LocalVideoProjectStore.js";

/** Orchestre les opérations du composant VoiceOverRepositoryImpl dans le flux applicatif. */
export class VoiceOverRepositoryImpl implements VoiceOverRepository {
/** Initialise l’instance avec les dépendances injectées nécessaires à son rôle. */
  public constructor(
    private readonly localVideoProjectStore: LocalVideoProjectStore,
  ) {}

/** Crée et persiste la ressource métier correspondant aux données reçues. */
  public create(voiceOver: VoiceOver): Promise<VoiceOver> {
    return this.localVideoProjectStore.createVoiceOver(voiceOver);
  }

/** Récupère la ressource demandée et signale son absence selon le contrat du service. */
  public getByVideoId(videoId: string): Promise<VoiceOver | null> {
    return this.localVideoProjectStore.getVoiceOver(videoId);
  }

/** Met à jour la ressource métier existante à partir des données reçues. */
  public update(voiceOver: VoiceOver): Promise<VoiceOver> {
    return this.localVideoProjectStore.updateVoiceOver(voiceOver);
  }
}
