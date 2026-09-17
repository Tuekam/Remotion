import type { ProductionPlan } from "../../../core/models/ProductionPlan.js";
import type { ProductionPlanRepository } from "../../../core/repository/ProductionPlanRepository.js";
import { LocalVideoProjectStore } from "../database/LocalVideoProjectStore.js";

export class ProductionPlanRepositoryImpl implements ProductionPlanRepository {
  public constructor(
    private readonly localVideoProjectStore: LocalVideoProjectStore,
  ) {}

  public create(plan: ProductionPlan): Promise<ProductionPlan> {
    return this.localVideoProjectStore.createProductionPlan(plan);
  }

  public getByVideoId(videoId: string): Promise<ProductionPlan | null> {
    return this.localVideoProjectStore.getProductionPlan(videoId);
  }

  public update(plan: ProductionPlan): Promise<ProductionPlan> {
    return this.localVideoProjectStore.updateProductionPlan(plan);
  }
}
