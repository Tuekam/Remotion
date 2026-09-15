import type { Video } from "../models/Video.ts";

export interface GetVideoRepository {
  getById(id: string): Promise<Video | null>;
}