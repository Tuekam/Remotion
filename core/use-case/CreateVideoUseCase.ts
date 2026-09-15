import type { CreateVideoInput, Video } from "../models/Video.ts";

export interface CreateVideoUseCase {
  execute(input: CreateVideoInput): Promise<Video>;
}