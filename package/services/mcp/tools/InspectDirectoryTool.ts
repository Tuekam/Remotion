import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/server";
import { WorkspaceFileService } from "../workspace/WorkspaceFileService.js";

/** Orchestre les opérations du composant InspectDirectoryTool dans le flux applicatif. */
export class InspectDirectoryTool {
/** Initialise l’instance avec les dépendances injectées nécessaires à son rôle. */
  public constructor(
    private readonly workspaceFileService: WorkspaceFileService,
  ) {}

/** Enregistre les outils du composant auprès du serveur MCP fourni. */
  public register(server: McpServer): void {
    server.registerTool(
      "inspect_directory",
      {
        description: "List files and directories inside a video workspace.",
        inputSchema: z.object({
          videoId: z.string().min(1),
          path: z.string().optional(),
        }),
      },
      async ({ videoId, path }) => ({
        content: [
          {
            type: "text",
            text: JSON.stringify(
              await this.workspaceFileService.inspectDirectory(videoId, path),
            ),
          },
        ],
      }),
    );
  }
}
