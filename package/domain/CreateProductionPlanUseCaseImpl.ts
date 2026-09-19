import type { ProductionPlan } from "../../core/models/ProductionPlan.js";
import type { CreateProductionPlanRequest } from "../../core/use-case/CreateProductionPlanUseCase.js";
import type { CreateProductionPlanUseCase } from "../../core/use-case/CreateProductionPlanUseCase.js";
import { ProductionPlanServiceImpl } from "../services/audio/production/ProductionPlanServiceImpl.js";

/** Orchestre les opérations du composant CreateProductionPlanUseCaseImpl dans le flux applicatif. */
export class CreateProductionPlanUseCaseImpl
  implements CreateProductionPlanUseCase
{
/** Initialise l’instance avec les dépendances injectées nécessaires à son rôle. */
  public constructor(
    private readonly productionPlanService: ProductionPlanServiceImpl,
  ) {}

  /** Delegue la construction du plan de production au service audio injecte. */
  public execute(input: CreateProductionPlanRequest): Promise<ProductionPlan> {
    return this.productionPlanService.create(input);
  }
}
