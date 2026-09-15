import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/server";
import { RenderResultStore } from "../RenderResultStore.js";

export class GetRenderResultTool {
  public constructor(
    private readonly renderResultStore: RenderResultStore,
  ) {}

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
