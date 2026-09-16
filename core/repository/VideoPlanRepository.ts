import type { VideoPlan } from "../models/VideoPlan.js";

export interface VideoPlanRepository {
  create(plan: VideoPlan): Promise<VideoPlan>;
  getByVideoId(videoId: string): Promise<VideoPlan | null>;
  update(plan: VideoPlan): Promise<VideoPlan>;
}
