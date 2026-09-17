import type { ProductionPlan } from "../models/ProductionPlan.js";

export interface ProductionPlanRepository {
  create(plan: ProductionPlan): Promise<ProductionPlan>;
  getByVideoId(videoId: string): Promise<ProductionPlan | null>;
  update(plan: ProductionPlan): Promise<ProductionPlan>;
}
