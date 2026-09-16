import type { VideoPlan } from "../models/VideoPlan.js";

export interface GetVideoPlanUseCase {
  execute(videoId: string): Promise<VideoPlan>;
}
