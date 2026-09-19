import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/server";
import { WorkspaceFileService } from "../workspace/WorkspaceFileService.js";

/** Orchestre les opérations du composant DeleteFileTool dans le flux applicatif. */
export class DeleteFileTool {
/** Initialise l’instance avec les dépendances injectées nécessaires à son rôle. */
  public constructor(
    private readonly workspaceFileService: WorkspaceFileService,
  ) {}

/** Enregistre les outils du composant auprès du serveur MCP fourni. */
  public register(server: McpServer): void {
    server.registerTool(
      "delete_file",
      {
        description: "Delete a file or directory inside a video workspace.",
        inputSchema: z.object({
          videoId: z.string().min(1),
          path: z.string().min(1),
        }),
      },
      async ({ videoId, path }) => {
        await this.workspaceFileService.delete(videoId, path);
        return { content: [{ type: "text", text: "Path deleted." }] };
      },
    );
  }
}
