import { bundle } from "@remotion/bundler";
import type {
  VideoBundle,
  VideoBundleInput,
  VideoBundler,
} from "../contracts/VideoBundler.js";

export class RemotionBundlerImpl implements VideoBundler {
  public async bundle(input: VideoBundleInput): Promise<VideoBundle> {
    const serveUrl = await bundle({
      entryPoint: input.entryPoint,
      onProgress: () => undefined,
    });

    return { serveUrl };
  }
}
