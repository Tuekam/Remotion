import type { RenderVideoInput } from "../../../../core/models/RenderVideoInput.js";
import type { VideoBundle } from "./VideoBundler.js";

/** Contrat des données VideoRenderer utilisé dans le domaine vidéo. */
export interface VideoRenderer {
  render(input: RenderVideoInput, bundle: VideoBundle): Promise<void>;
}
