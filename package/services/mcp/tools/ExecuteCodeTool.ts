import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/server";
import { WorkspaceExecutionService } from "../workspace/WorkspaceExecutionService.js";

/** Orchestre les opérations du composant ExecuteCodeTool dans le flux applicatif. */
export class ExecuteCodeTool {
/** Initialise l’instance avec les dépendances injectées nécessaires à son rôle. */
  public constructor(
    private readonly workspaceExecutionService: WorkspaceExecutionService,
  ) {}

/** Enregistre les outils du composant auprès du serveur MCP fourni. */
  public register(server: McpServer): void {
    server.registerTool(
      "execute_code",
      {
        description:
          "Execute a restricted pnpm command in a video workspace.",
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
