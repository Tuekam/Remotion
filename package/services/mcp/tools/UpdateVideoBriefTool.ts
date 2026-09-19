import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/server";
import type { UpdateVideoBriefUseCase } from "../../../../core/use-case/UpdateVideoBriefUseCase.js";

/** Orchestre les opérations du composant UpdateVideoBriefTool dans le flux applicatif. */
export class UpdateVideoBriefTool {
/** Initialise l’instance avec les dépendances injectées nécessaires à son rôle. */
  public constructor(
    private readonly updateVideoBriefUseCase: UpdateVideoBriefUseCase,
  ) {}

/** Enregistre les outils du composant auprès du serveur MCP fourni. */
  public register(server: McpServer): void {
    server.registerTool(
      "update_video_brief",
      {
        description: "Update the free-form production prompt of a video project.",
        inputSchema: z.object({
          videoId: z.string().min(1),
          prompt: z.string().min(1).nullable().optional(),
        }),
      },
      async ({ videoId, ...input }) => ({
        content: [
          {
            type: "text",
            text: JSON.stringify(
              await this.updateVideoBriefUseCase.execute(videoId, {
                ...input,
              }),
            ),
          },
        ],
      }),
    );
  }
}
