import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/server";
import { WorkspaceFileService } from "../WorkspaceFileService.js";

export class ReadFileTool {
  public constructor(
    private readonly workspaceFileService: WorkspaceFileService,
  ) {}

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
