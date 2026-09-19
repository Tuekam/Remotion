import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/server";
import { WorkspaceFileService } from "../workspace/WorkspaceFileService.js";

/** Orchestre les opérations du composant InspectAssetTool dans le flux applicatif. */
export class InspectAssetTool {
/** Initialise l’instance avec les dépendances injectées nécessaires à son rôle. */
  public constructor(
    private readonly workspaceFileService: WorkspaceFileService,
  ) {}

/** Enregistre les outils du composant auprès du serveur MCP fourni. */
  public register(server: McpServer): void {
    server.registerTool(
      "inspect_asset",
      {
        description: "Inspect metadata for an asset in a video workspace.",
        inputSchema: z.object({
          videoId: z.string().min(1),
          path: z.string().min(1),
        }),
      },
      async ({ videoId, path }) => {
        const metadata = await this.workspaceFileService.inspectAsset(
          videoId,
          path,
        );
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                path,
                size: metadata.size,
                isFile: metadata.isFile(),
                isDirectory: metadata.isDirectory(),
                modifiedAt: metadata.mtime.toISOString(),
              }),
            },
          ],
        };
      },
    );
  }
}
