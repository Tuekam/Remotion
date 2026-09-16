import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/server";
import type { GetVideoRequirementsUseCase } from "../../../../core/use-case/GetVideoRequirementsUseCase.js";
import type { VideoTypeId } from "../../../../core/models/VideoType.js";

const videoTypeIds = [
  "product-presentation",
  "product-promotion",
  "product-demo",
  "service-presentation",
  "problem-solution",
  "company-presentation",
  "testimonial",
  "event-promotion",
] as const;

export class GetVideoRequirementsTool {
  public constructor(
    private readonly getVideoRequirementsUseCase: GetVideoRequirementsUseCase,
  ) {}

  public register(server: McpServer): void {
    server.registerTool(
      "get_video_requirements",
      {
        description: "Get the information and asset requirements for a video type.",
        inputSchema: z.object({ videoType: z.enum(videoTypeIds) }),
      },
      async ({ videoType }) => ({
        content: [
          {
            type: "text",
            text: JSON.stringify(
              await this.getVideoRequirementsUseCase.execute(
                videoType as VideoTypeId,
              ),
            ),
          },
        ],
      }),
    );
  }
}
