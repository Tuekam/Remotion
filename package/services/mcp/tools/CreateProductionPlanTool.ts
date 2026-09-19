import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/server";
import type { CreateProductionPlanUseCase } from "../../../../core/use-case/CreateProductionPlanUseCase.js";

/** Orchestre les opérations du composant CreateProductionPlanTool dans le flux applicatif. */
export class CreateProductionPlanTool {
/** Initialise l’instance avec les dépendances injectées nécessaires à son rôle. */
  public constructor(
    private readonly createProductionPlanUseCase: CreateProductionPlanUseCase,
  ) {}

/** Enregistre les outils du composant auprès du serveur MCP fourni. */
  public register(server: McpServer): void {
    server.registerTool(
      "create_production_plan",
      {
        description: "Create the audiovisual production plan from video and audio data.",
        inputSchema: z.object({
          videoId: z.string().min(1),
          voiceOver: z.any(),
          musicTracks: z.array(z.any()).optional(),
          fps: z.number().positive(),
          durationTargetMs: z.number().positive().optional(),
        }),
      },
      async (input) => {
        const request = {
          videoId: input.videoId,
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
