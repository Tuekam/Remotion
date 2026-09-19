import { bundle } from "@remotion/bundler";
import type {
  VideoBundle,
  VideoBundleInput,
  VideoBundler,
} from "../../contracts/VideoBundler.js";

/** Orchestre les opérations du composant RemotionBundlerImpl dans le flux applicatif. */
export class RemotionBundlerImpl implements VideoBundler {
  /** Cree un bundle Remotion isole a partir du repertoire public prepare. */
  public async bundle(input: VideoBundleInput): Promise<VideoBundle> {
    const serveUrl = await bundle({
      entryPoint: input.entryPoint,
      publicDir: input.publicDir,
      onProgress: () => undefined,
    });

    return { serveUrl };
  }
}
