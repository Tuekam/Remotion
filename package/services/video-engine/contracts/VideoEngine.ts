import type { Render } from "../../../../core/models/Render.js";
import type { RenderVideoInput } from "../../../../core/models/RenderVideoInput.js";
import type { VideoWorkspace } from "../../../../core/models/VideoWorkspace.js";

/** Contrat des données VideoEngine utilisé dans le domaine vidéo. */
export interface VideoEngine {
  getWorkspace(videoId: string): Promise<VideoWorkspace>;
  render(input: RenderVideoInput): Promise<Render>;
}
