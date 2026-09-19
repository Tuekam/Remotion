import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/server";
import type { GetVoiceOverUseCase } from "../../../../core/use-case/GetVoiceOverUseCase.js";

/** Orchestre les opérations du composant GetVoiceOverTool dans le flux applicatif. */
export class GetVoiceOverTool {
/** Initialise l’instance avec les dépendances injectées nécessaires à son rôle. */
  public constructor(
    private readonly getVoiceOverUseCase: GetVoiceOverUseCase,
  ) {}

/** Enregistre les outils du composant auprès du serveur MCP fourni. */
  public register(server: McpServer): void {
    server.registerTool(
      "get_voice_over",
      {
        description: "Get the generated voice-over metadata for a video project.",
        inputSchema: z.object({ videoId: z.string().min(1) }),
      },
      async ({ videoId }) => ({
        content: [
          {
            type: "text",
            text: JSON.stringify(await this.getVoiceOverUseCase.execute(videoId)),
          },
        ],
      }),
    );
  }
}
