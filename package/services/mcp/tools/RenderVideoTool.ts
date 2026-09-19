import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/server";
import type { RenderVideoInput } from "../../../../core/models/RenderVideoInput.js";
import type { VideoEngine } from "../../video-engine/contracts/VideoEngine.js";
import { RenderResultStore } from "../rendering/RenderResultStore.js";
import { RenderOutputPathResolver } from "../rendering/RenderOutputPathResolver.js";

/** Orchestre les opérations du composant RenderVideoTool dans le flux applicatif. */
export class RenderVideoTool {
/** Initialise l’instance avec les dépendances injectées nécessaires à son rôle. */
  public constructor(
    private readonly videoEngine: VideoEngine,
    private readonly renderResultStore: RenderResultStore,
    private readonly renderOutputPathResolver: RenderOutputPathResolver,
  ) {}

/** Enregistre les outils du composant auprès du serveur MCP fourni. */
  public register(server: McpServer): void {
    server.registerTool(
      "render_video",
      {
        description: "Render a Remotion composition from a video workspace.",
        inputSchema: z.object({
          videoId: z.string().min(1),
          compositionId: z.string().min(1),
          outputPath: z.string().min(1),
        }),
      },
      async (input: RenderVideoInput) => {
        await this.renderOutputPathResolver.ensureDirectory();
        const render = await this.videoEngine.render({
          ...input,
          outputPath: this.renderOutputPathResolver.resolve(input.outputPath),
        });
        await this.renderResultStore.save(render);
        return {
          content: [{ type: "text", text: JSON.stringify(render) }],
        };
      },
    );
  }

}
