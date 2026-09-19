import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/server";
import { WorkspaceFileService } from "../workspace/WorkspaceFileService.js";

/** Orchestre les opérations du composant ReadFileTool dans le flux applicatif. */
export class ReadFileTool {
/** Initialise l’instance avec les dépendances injectées nécessaires à son rôle. */
  public constructor(
    private readonly workspaceFileService: WorkspaceFileService,
  ) {}

/** Enregistre les outils du composant auprès du serveur MCP fourni. */
  public register(server: McpServer): void {
    server.registerTool(
      "read_file",
      {
        description: "Read a UTF-8 file from a video workspace.",
        inputSchema: z.object({
          videoId: z.string().min(1),
          path: z.string().min(1),
        }),
      },
      async ({ videoId, path }) => ({
        content: [
          {
            type: "text",
            text: await this.workspaceFileService.read(videoId, path),
          },
        ],
      }),
    );
  }
}
