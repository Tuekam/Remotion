import type { Render } from "../models/Render.ts";

export interface GenerateVideoInput {
  videoId: string;
}

export interface GenerateVideoService {
  generate(input: GenerateVideoInput): Promise<Render>;
}

export interface GenerateVideoUseCase {
  execute(input: GenerateVideoInput): Promise<Render>;
}