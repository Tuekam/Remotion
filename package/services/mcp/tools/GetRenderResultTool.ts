import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/server";
import { RenderResultStore } from "../rendering/RenderResultStore.js";

/** Orchestre les opérations du composant GetRenderResultTool dans le flux applicatif. */
export class GetRenderResultTool {
/** Initialise l’instance avec les dépendances injectées nécessaires à son rôle. */
  public constructor(
    private readonly renderResultStore: RenderResultStore,
  ) {}

/** Enregistre les outils du composant auprès du serveur MCP fourni. */
  public register(server: McpServer): void {
    server.registerTool(
      "get_render_result",
      {
        description: "Get a previously completed or failed render result.",
        inputSchema: z.object({
          renderId: z.string().min(1),
        }),
      },
      async ({ renderId }) => {
        const render = await this.renderResultStore.get(renderId);
        if (!render) {
          throw new Error(`Render not found: ${renderId}`);
        }
        return {
          content: [{ type: "text", text: JSON.stringify(render) }],
        };
      },
    );
  }
}
