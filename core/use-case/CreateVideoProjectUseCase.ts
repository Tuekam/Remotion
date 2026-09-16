import type { VideoBrief } from "../models/VideoBrief.js";

export interface CreateVideoProjectInput {
  videoId: string;
}

export interface CreateVideoProjectUseCase {
  execute(input: CreateVideoProjectInput): Promise<VideoBrief>;
}
