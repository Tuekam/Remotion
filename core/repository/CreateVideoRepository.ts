import type { CreateVideoInput, Video } from "../models/Video.ts";

export interface CreateVideoRepository {
  create(input: CreateVideoInput): Promise<Video>;
}