import type { VideoPlan } from "../models/VideoPlan.js";

export interface CreateVideoPlanUseCase {
  execute(videoId: string): Promise<VideoPlan>;
}
