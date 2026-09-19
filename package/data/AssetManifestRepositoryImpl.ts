import type { AssetManifest } from "../../core/models/AssetManifest.js";
import type { AssetManifestRepository } from "../../core/repository/AssetManifestRepository.js";
import { LocalVideoProjectStore } from "./database/LocalVideoProjectStore.js";

/** Orchestre les opérations du composant AssetManifestRepositoryImpl dans le flux applicatif. */
export class AssetManifestRepositoryImpl implements AssetManifestRepository {
/** Initialise l’instance avec les dépendances injectées nécessaires à son rôle. */
  public constructor(private readonly localVideoProjectStore: LocalVideoProjectStore) {}

/** Crée et persiste la ressource métier correspondant aux données reçues. */
  public create(manifest: AssetManifest): Promise<AssetManifest> {
    return this.localVideoProjectStore.createManifest(manifest);
  }

/** Récupère la ressource demandée et signale son absence selon le contrat du service. */
  public getByVideoId(videoId: string): Promise<AssetManifest | null> {
    return this.localVideoProjectStore.getManifest(videoId);
  }

/** Met à jour la ressource métier existante à partir des données reçues. */
  public update(manifest: AssetManifest): Promise<AssetManifest> {
    return this.localVideoProjectStore.updateManifest(manifest);
  }
}
