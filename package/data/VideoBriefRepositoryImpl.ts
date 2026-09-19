import type { VideoBrief } from "../../core/models/VideoBrief.js";
import type { VideoBriefRepository } from "../../core/repository/VideoBriefRepository.js";
import { LocalVideoProjectStore } from "./database/LocalVideoProjectStore.js";

/** Orchestre les opérations du composant VideoBriefRepositoryImpl dans le flux applicatif. */
export class VideoBriefRepositoryImpl implements VideoBriefRepository {
/** Initialise l’instance avec les dépendances injectées nécessaires à son rôle. */
  public constructor(private readonly localVideoProjectStore: LocalVideoProjectStore) {}

/** Crée et persiste la ressource métier correspondant aux données reçues. */
  public create(brief: VideoBrief): Promise<VideoBrief> {
    return this.localVideoProjectStore.createBrief(brief);
  }

/** Récupère la ressource demandée et signale son absence selon le contrat du service. */
  public getByVideoId(videoId: string): Promise<VideoBrief | null> {
    return this.localVideoProjectStore.getBrief(videoId);
  }

/** Met à jour la ressource métier existante à partir des données reçues. */
  public update(brief: VideoBrief): Promise<VideoBrief> {
    return this.localVideoProjectStore.updateBrief(brief);
  }
}
