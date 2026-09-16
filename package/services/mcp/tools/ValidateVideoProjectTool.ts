import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/server";
import type { ValidateVideoProjectUseCase } from "../../../../core/use-case/ValidateVideoProjectUseCase.js";

export class ValidateVideoProjectTool {
  public constructor(
    private readonly validateVideoProjectUseCase: ValidateVideoProjectUseCase,
  ) {}

  public register(server: McpServer): void {
    server.registerTool(
      "validate_video_project",
      {
        description: "Validate a video brief and its project assets.",
        inputSchema: z.object({ videoId: z.string().min(1) }),
      },
      async ({ videoId }) => ({
        content: [
          {
            type: "text",
            text: JSON.stringify(
              await this.validateVideoProjectUseCase.execute(videoId),
            ),
          },
        ],
      }),
    );
  }
}
