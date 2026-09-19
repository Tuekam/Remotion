import type { ProductionPlan } from "../models/ProductionPlan.js";

/** Contrat des données ProductionPlanRepository utilisé dans le domaine vidéo. */
export interface ProductionPlanRepository {
  create(plan: ProductionPlan): Promise<ProductionPlan>;
  getByVideoId(videoId: string): Promise<ProductionPlan | null>;
  update(plan: ProductionPlan): Promise<ProductionPlan>;
}
