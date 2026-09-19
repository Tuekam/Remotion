import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/server";
import { WorkspaceFileService } from "../workspace/WorkspaceFileService.js";

/** Orchestre les opérations du composant UpdateFileTool dans le flux applicatif. */
export class UpdateFileTool {
/** Initialise l’instance avec les dépendances injectées nécessaires à son rôle. */
  public constructor(
    private readonly workspaceFileService: WorkspaceFileService,
  ) {}

/** Enregistre les outils du composant auprès du serveur MCP fourni. */
  public register(server: McpServer): void {
    server.registerTool(
      "update_file",
      {
        description: "Update an existing UTF-8 file in a video workspace.",
        inputSchema: z.object({
          videoId: z.string().min(1),
          path: z.string().min(1),
          content: z.string(),
        }),
      },
      async ({ videoId, path, content }) => {
        await this.workspaceFileService.update(videoId, path, content);
        return { content: [{ type: "text", text: "File updated." }] };
      },
    );
  }
}
