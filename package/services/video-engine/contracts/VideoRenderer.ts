import type { RenderVideoInput } from "../models/RenderVideoInput.js";
import type { VideoBundle } from "./VideoBundler.js";

export interface VideoRenderer {
  render(input: RenderVideoInput, bundle: VideoBundle): Promise<void>;
}
