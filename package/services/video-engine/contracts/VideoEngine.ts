import type { Render } from "../../../../core/models/Render.js";
import type { RenderVideoInput } from "../models/RenderVideoInput.js";
import type { VideoWorkspace } from "../models/VideoWorkspace.js";

export interface VideoEngine {
  getWorkspace(videoId: string): Promise<VideoWorkspace>;
  execute(videoId: string): Promise<void>;
  render(input: RenderVideoInput): Promise<Render>;
}
