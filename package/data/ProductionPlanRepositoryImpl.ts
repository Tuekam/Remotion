import type { ProductionPlan } from "../../core/models/ProductionPlan.js";
import type { ProductionPlanRepository } from "../../core/repository/ProductionPlanRepository.js";
import { LocalVideoProjectStore } from "./database/LocalVideoProjectStore.js";

/** Orchestre les opérations du composant ProductionPlanRepositoryImpl dans le flux applicatif. */
export class ProductionPlanRepositoryImpl implements ProductionPlanRepository {
/** Initialise l’instance avec les dépendances injectées nécessaires à son rôle. */
  public constructor(
    private readonly localVideoProjectStore: LocalVideoProjectStore,
  ) {}

/** Crée et persiste la ressource métier correspondant aux données reçues. */
  public create(plan: ProductionPlan): Promise<ProductionPlan> {
    return this.localVideoProjectStore.createProductionPlan(plan);
  }

/** Récupère la ressource demandée et signale son absence selon le contrat du service. */
  public getByVideoId(videoId: string): Promise<ProductionPlan | null> {
    return this.localVideoProjectStore.getProductionPlan(videoId);
  }

/** Met à jour la ressource métier existante à partir des données reçues. */
  public update(plan: ProductionPlan): Promise<ProductionPlan> {
    return this.localVideoProjectStore.updateProductionPlan(plan);
  }
}
