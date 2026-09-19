import type { Render } from "../../../../core/models/Render.js";
import type { RenderVideoInput } from "../../../../core/models/RenderVideoInput.js";
import type { VideoWorkspace } from "../../../../core/models/VideoWorkspace.js";

export interface VideoEngine {
  getWorkspace(videoId: string): Promise<VideoWorkspace>;
  execute(videoId: string): Promise<void>;
  render(input: RenderVideoInput): Promise<Render>;
}
