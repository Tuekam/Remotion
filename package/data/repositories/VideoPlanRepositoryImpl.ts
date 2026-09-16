import type { VideoPlan } from "../../../core/models/VideoPlan.js";
import type { VideoPlanRepository } from "../../../core/repository/VideoPlanRepository.js";
import { LocalVideoProjectStore } from "../database/LocalVideoProjectStore.js";

export class VideoPlanRepositoryImpl implements VideoPlanRepository {
  public constructor(private readonly localVideoProjectStore: LocalVideoProjectStore) {}

  public create(plan: VideoPlan): Promise<VideoPlan> {
    return this.localVideoProjectStore.createPlan(plan);
  }

  public getByVideoId(videoId: string): Promise<VideoPlan | null> {
    return this.localVideoProjectStore.getPlan(videoId);
  }

  public update(plan: VideoPlan): Promise<VideoPlan> {
    return this.localVideoProjectStore.updatePlan(plan);
  }
}
