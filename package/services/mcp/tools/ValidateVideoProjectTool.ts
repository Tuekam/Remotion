import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/server";
import type { ValidateVideoProjectUseCase } from "../../../../core/use-case/ValidateVideoProjectUseCase.js";

/** Orchestre les opérations du composant ValidateVideoProjectTool dans le flux applicatif. */
export class ValidateVideoProjectTool {
/** Initialise l’instance avec les dépendances injectées nécessaires à son rôle. */
  public constructor(
    private readonly validateVideoProjectUseCase: ValidateVideoProjectUseCase,
  ) {}

/** Enregistre les outils du composant auprès du serveur MCP fourni. */
  public register(server: McpServer): void {
    server.registerTool(
      "validate_video_project",
      {
        description: "Validate a video brief and its project assets.",
        inputSchema: z.object({ videoId: z.string().min(1) }),
      },
      async ({ videoId }) => ({
        content: [
          {
            type: "text",
            text: JSON.stringify(
              await this.validateVideoProjectUseCase.execute(videoId),
            ),
          },
        ],
      }),
    );
  }
}
