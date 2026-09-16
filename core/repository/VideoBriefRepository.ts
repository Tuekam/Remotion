import type { VideoBrief } from "../models/VideoBrief.js";

export interface VideoBriefRepository {
  create(brief: VideoBrief): Promise<VideoBrief>;
  getByVideoId(videoId: string): Promise<VideoBrief | null>;
  update(brief: VideoBrief): Promise<VideoBrief>;
}
