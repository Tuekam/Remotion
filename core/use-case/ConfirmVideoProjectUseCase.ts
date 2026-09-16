import type { VideoBrief } from "../models/VideoBrief.js";

export interface ConfirmVideoProjectUseCase {
  execute(videoId: string): Promise<VideoBrief>;
}
