import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/server";
import type { CreateProductionPlanUseCase } from "../../../../core/use-case/CreateProductionPlanUseCase.js";

export class CreateProductionPlanTool {
  public constructor(
    private readonly createProductionPlanUseCase: CreateProductionPlanUseCase,
  ) {}

  public register(server: McpServer): void {
    server.registerTool(
      "create_production_plan",
      {
        description: "Create the audiovisual production plan from video and audio data.",
        inputSchema: z.object({
          videoId: z.string().min(1),
          videoPlan: z.any(),
          voiceOver: z.any(),
          musicTracks: z.array(z.any()).optional(),
          fps: z.number().positive(),
          durationTargetMs: z.number().positive().optional(),
        }),
      },
      async (input) => {
        const request = {
          videoId: input.videoId,
          videoPlan: input.videoPlan,
          voiceOver: input.voiceOver,
          fps: input.fps,
        };
        if (input.musicTracks) {
          Object.assign(request, { musicTracks: input.musicTracks });
        }
        if (input.durationTargetMs !== undefined) {
          Object.assign(request, { durationTargetMs: input.durationTargetMs });
        }
        return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              await this.createProductionPlanUseCase.execute(request),
            ),
          },
        ],
        };
      },
    );
  }
}
