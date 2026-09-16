import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/server";
import type { CreateVideoProjectUseCase } from "../../../../core/use-case/CreateVideoProjectUseCase.js";

export class CreateVideoProjectTool {
  public constructor(
    private readonly createVideoProjectUseCase: CreateVideoProjectUseCase,
  ) {}

  public register(server: McpServer): void {
    server.registerTool(
      "create_video_project",
      {
        description: "Create an isolated V2 video project and its initial brief.",
        inputSchema: z.object({ videoId: z.string().min(1) }),
      },
      async ({ videoId }) => ({
        content: [
          {
            type: "text",
            text: JSON.stringify(
              await this.createVideoProjectUseCase.execute({ videoId }),
            ),
          },
        ],
      }),
    );
  }
}
