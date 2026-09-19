import type { ProductionPlan } from "../../../../core/models/ProductionPlan.js";
import type { CreateProductionPlanRequest } from "../../../../core/use-case/CreateProductionPlanUseCase.js";

export type { CreateProductionPlanRequest };

export interface ProductionPlanService {
  create(request: CreateProductionPlanRequest): Promise<ProductionPlan>;
}
