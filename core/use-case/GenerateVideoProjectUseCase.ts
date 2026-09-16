import type { Render } from "../models/Render.js";

export interface GenerateVideoProjectInput {
  videoId: string;
  compositionId: string;
  outputPath: string;
}

export interface GenerateVideoProjectUseCase {
  execute(input: GenerateVideoProjectInput): Promise<Render>;
}
