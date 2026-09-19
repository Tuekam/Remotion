import type { RenderVideoInput } from "../../../../core/models/RenderVideoInput.js";
import type { VideoBundle } from "./VideoBundler.js";

export interface VideoRenderer {
  render(input: RenderVideoInput, bundle: VideoBundle): Promise<void>;
}
