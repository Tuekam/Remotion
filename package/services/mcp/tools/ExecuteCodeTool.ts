import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/server";
import { WorkspaceExecutionService } from "../WorkspaceExecutionService.js";

export class ExecuteCodeTool {
  public constructor(
    private readonly workspaceExecutionService: WorkspaceExecutionService,
  ) {}

  public register(server: McpServer): void {
    server.registerTool(
      "execute_code",
      {
        description:
          "Execute an allowlisted workspace command. Only pnpm is permitted.",
        inputSchema: z.object({
          videoId: z.string().min(1),
          command: z.literal("pnpm"),
          args: z.array(z.string()).max(20),
        }),
      },
      async ({ videoId, command, args }) => {
        const result = await this.workspaceExecutionService.execute(
          videoId,
          command,
          args,
        );
        return {
          content: [{ type: "text", text: JSON.stringify(result) }],
        };
      },
    );
  }
}
