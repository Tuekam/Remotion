import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/server";
import { WorkspaceFileService } from "../WorkspaceFileService.js";

export class InspectDirectoryTool {
  public constructor(
    private readonly workspaceFileService: WorkspaceFileService,
  ) {}

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
