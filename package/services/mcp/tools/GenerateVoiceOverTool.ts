import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/server";
import type { GenerateVoiceOverUseCase } from "../../../../core/use-case/GenerateVoiceOverUseCase.js";

/** Orchestre les opérations du composant GenerateVoiceOverTool dans le flux applicatif. */
export class GenerateVoiceOverTool {
/** Initialise l’instance avec les dépendances injectées nécessaires à son rôle. */
  public constructor(
    private readonly generateVoiceOverUseCase: GenerateVoiceOverUseCase,
  ) {}

/** Enregistre les outils du composant auprès du serveur MCP fourni. */
  public register(server: McpServer): void {
    server.registerTool(
      "generate_voice_over",
      {
        description: "Generate and cache one global voice-over for a video project.",
        inputSchema: z.object({
          videoId: z.string().min(1),
          script: z.string().min(1),
          voiceId: z.string().min(1),
          language: z.string().min(1),
          model: z.string().min(1).optional(),
          outputFormat: z.string().min(1).optional(),
          voiceSettings: z
            .object({
              stability: z.number().min(0).max(1).optional(),
              similarityBoost: z.number().min(0).max(1).optional(),
              style: z.number().min(0).max(1).optional(),
              useSpeakerBoost: z.boolean().optional(),
              speed: z.number().min(0.7).max(1.2).optional(),
            })
            .optional(),
        }),
      },
      async (input) => {
        const request = {
          videoId: input.videoId,
          script: input.script,
          voiceId: input.voiceId,
          language: input.language,
        };
        if (input.model) {
          Object.assign(request, { model: input.model });
        }
        if (input.outputFormat) {
          Object.assign(request, { outputFormat: input.outputFormat });
        }
        if (input.voiceSettings) {
          Object.assign(request, { voiceSettings: input.voiceSettings });
        }
        return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              await this.generateVoiceOverUseCase.execute(request),
            ),
          },
        ],
        };
      },
    );
  }
}
