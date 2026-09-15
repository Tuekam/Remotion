import type { UpdateVideoInput, Video } from "../models/Video.ts";

export interface UpdateVideoRepository {
  update(id: string, input: UpdateVideoInput): Promise<Video | null>;
}