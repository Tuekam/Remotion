import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/server";
import type { CreateVideoPlanUseCase } from "../../../../core/use-case/CreateVideoPlanUseCase.js";

export class CreateVideoPlanTool {
  public constructor(
    private readonly createVideoPlanUseCase: CreateVideoPlanUseCase,
  ) {}

  public register(server: McpServer): void {
    server.registerTool(
      "create_video_plan",
      {
        description: "Create a natural-language production plan for a validated project.",
        inputSchema: z.object({ videoId: z.string().min(1) }),
      },
      async ({ videoId }) => ({
        content: [
          {
            type: "text",
            text: JSON.stringify(
              await this.createVideoPlanUseCase.execute(videoId),
            ),
          },
        ],
      }),
    );
  }
}
