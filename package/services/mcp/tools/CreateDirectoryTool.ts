import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/server";
import { WorkspaceFileService } from "../WorkspaceFileService.js";

export class CreateDirectoryTool {
  public constructor(
    private readonly workspaceFileService: WorkspaceFileService,
  ) {}

  public register(server: McpServer): void {
    server.registerTool(
      "create_directory",
      {
        description: "Create a directory inside a video workspace.",
        inputSchema: z.object({
          videoId: z.string().min(1),
          path: z.string().min(1),
        }),
      },
      async ({ videoId, path }) => {
        await this.workspaceFileService.createDirectory(videoId, path);
        return { content: [{ type: "text", text: "Directory created." }] };
      },
    );
  }
}
