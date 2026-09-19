import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/server";
import type { ConfirmVideoProjectUseCase } from "../../../../core/use-case/ConfirmVideoProjectUseCase.js";

/** Orchestre les opérations du composant ConfirmVideoProjectTool dans le flux applicatif. */
export class ConfirmVideoProjectTool {
/** Initialise l’instance avec les dépendances injectées nécessaires à son rôle. */
  public constructor(
    private readonly confirmVideoProjectUseCase: ConfirmVideoProjectUseCase,
  ) {}

/** Enregistre les outils du composant auprès du serveur MCP fourni. */
  public register(server: McpServer): void {
    server.registerTool(
      "confirm_video_project",
      {
        description: "Confirm a prepared video project for production.",
        inputSchema: z.object({ videoId: z.string().min(1) }),
      },
      async ({ videoId }) => ({
        content: [
          {
            type: "text",
            text: JSON.stringify(
              await this.confirmVideoProjectUseCase.execute(videoId),
            ),
          },
        ],
      }),
    );
  }
}
