import type { Render } from "../models/Render.js";

export interface GenerateVideoInput {
  videoId: string;
  compositionId: string;
  outputPath: string;
  inputProps?: Record<string, unknown>;
}

export interface GenerateVideoService {
  generate(input: GenerateVideoInput): Promise<Render>;
}

export interface GenerateVideoUseCase {
  execute(input: GenerateVideoInput): Promise<Render>;
}