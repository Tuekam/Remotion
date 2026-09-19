import { bundle } from "@remotion/bundler";
import type {
  VideoBundle,
  VideoBundleInput,
  VideoBundler,
} from "../../contracts/VideoBundler.js";

export class RemotionBundlerImpl implements VideoBundler {
  /** Creates an isolated Remotion bundle from the prepared public directory. */
  public async bundle(input: VideoBundleInput): Promise<VideoBundle> {
    const serveUrl = await bundle({
      entryPoint: input.entryPoint,
      publicDir: input.publicDir,
      onProgress: () => undefined,
    });

    return { serveUrl };
  }
}
