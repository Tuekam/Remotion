import type { ProductionPlan } from "../../core/models/ProductionPlan.js";
import type { CreateProductionPlanRequest } from "../../core/use-case/CreateProductionPlanUseCase.js";
import type { CreateProductionPlanUseCase } from "../../core/use-case/CreateProductionPlanUseCase.js";
import type { ProductionPlanService } from "../services/audio/contracts/ProductionPlanService.js";

export class CreateProductionPlanUseCaseImpl
  implements CreateProductionPlanUseCase
{
  public constructor(
    private readonly productionPlanService: ProductionPlanService,
  ) {}

  /** Delegates production-plan construction to the injected audio service. */
  public execute(input: CreateProductionPlanRequest): Promise<ProductionPlan> {
    return this.productionPlanService.create(input);
  }
}
