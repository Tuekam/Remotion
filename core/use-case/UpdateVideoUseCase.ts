import type { UpdateVideoInput, Video } from "../models/Video.ts";

export interface UpdateVideoUseCase {
  execute(id: string, input: UpdateVideoInput): Promise<Video | null>;
}