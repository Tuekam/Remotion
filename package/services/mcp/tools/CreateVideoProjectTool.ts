import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/server";
import type { CreateVideoProjectUseCase } from "../../../../core/use-case/CreateVideoProjectUseCase.js";

/** Orchestre les opérations du composant CreateVideoProjectTool dans le flux applicatif. */
export class CreateVideoProjectTool {
/** Initialise l’instance avec les dépendances injectées nécessaires à son rôle. */
  public constructor(
    private readonly createVideoProjectUseCase: CreateVideoProjectUseCase,
  ) {}

/** Enregistre les outils du composant auprès du serveur MCP fourni. */
  public register(server: McpServer): void {
    server.registerTool(
      "create_video_project",
      {
        description: "Create an isolated V2 video project and its initial brief.",
        inputSchema: z.object({ videoId: z.string().min(1) }),
      },
      async ({ videoId }) => ({
        content: [
          {
            type: "text",
            text: JSON.stringify(
              await this.createVideoProjectUseCase.execute({ videoId }),
            ),
          },
        ],
      }),
    );
  }
}
