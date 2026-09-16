import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/server";
import type { GetVideoPlanUseCase } from "../../../../core/use-case/GetVideoPlanUseCase.js";

export class GetVideoPlanTool {
  public constructor(
    private readonly getVideoPlanUseCase: GetVideoPlanUseCase,
  ) {}

  public register(server: McpServer): void {
    server.registerTool(
      "get_video_plan",
      {
        description: "Get the natural-language production plan for a video project.",
        inputSchema: z.object({ videoId: z.string().min(1) }),
      },
      async ({ videoId }) => ({
        content: [
          {
            type: "text",
            text: JSON.stringify(await this.getVideoPlanUseCase.execute(videoId)),
          },
        ],
      }),
    );
  }
}
