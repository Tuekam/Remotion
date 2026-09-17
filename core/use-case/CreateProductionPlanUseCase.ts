import type { ProductionPlan } from "../models/ProductionPlan.js";
import type { CreateProductionPlanRequest } from "../../package/services/audio/production/contracts/ProductionPlanService.js";

export interface CreateProductionPlanUseCase {
  execute(input: CreateProductionPlanRequest): Promise<ProductionPlan>;
}
