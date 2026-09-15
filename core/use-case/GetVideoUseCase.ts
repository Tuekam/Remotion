import type { Video } from "../models/Video.ts";

export interface GetVideoUseCase {
  execute(id: string): Promise<Video | null>;
}