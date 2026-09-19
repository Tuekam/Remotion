import { renderMedia, selectComposition } from "@remotion/renderer";
import type { RenderVideoInput } from "../../../../../core/models/RenderVideoInput.js";
import type { VideoBundle } from "../../contracts/VideoBundler.js";
import type { VideoRenderer } from "../../contracts/VideoRenderer.js";

/** Orchestre les opérations du composant RemotionRendererImpl dans le flux applicatif. */
export class RemotionRendererImpl implements VideoRenderer {
  /** Selectionne la composition demandee et la rend vers le chemin de sortie fourni. */
  public async render(
    input: RenderVideoInput,
    bundle: VideoBundle,
  ): Promise<void> {
    const composition = await selectComposition({
      serveUrl: bundle.serveUrl,
      id: input.compositionId,
      inputProps: input.inputProps,
    });

    const renderOptions: Parameters<typeof renderMedia>[0] = {
      serveUrl: bundle.serveUrl,
      composition,
      codec: "h264",
      outputLocation: input.outputPath,
      overwrite: true,
    };
    if (input.inputProps) {
      Object.assign(renderOptions, { inputProps: input.inputProps });
    }
    await renderMedia(renderOptions);
  }
}
