import type { ProductionPlan } from "../../core/models/ProductionPlan.js";
import type { CreateProductionPlanUseCase } from "../../core/use-case/CreateProductionPlanUseCase.js";
import type { CreateProductionPlanRequest, ProductionPlanService } from "../services/audio/production/contracts/ProductionPlanService.js";

export class CreateProductionPlanUseCaseImpl
  implements CreateProductionPlanUseCase
{
  public constructor(
    private readonly productionPlanService: ProductionPlanService,
  ) {}

  public execute(input: CreateProductionPlanRequest): Promise<ProductionPlan> {
    return this.productionPlanService.create(input);
  }
}
