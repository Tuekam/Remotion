import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/server";
import { WorkspaceFileService } from "../WorkspaceFileService.js";

export class DeleteFileTool {
  public constructor(
    private readonly workspaceFileService: WorkspaceFileService,
  ) {}

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
