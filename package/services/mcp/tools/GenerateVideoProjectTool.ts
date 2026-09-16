import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/server";
import type { GenerateVideoProjectUseCase } from "../../../../core/use-case/GenerateVideoProjectUseCase.js";
import { RenderResultStore } from "../RenderResultStore.js";
import { RenderOutputPathResolver } from "../RenderOutputPathResolver.js";

export class GenerateVideoProjectTool {
  public constructor(
    private readonly generateVideoProjectUseCase: GenerateVideoProjectUseCase,
    private readonly renderResultStore: RenderResultStore,
    private readonly renderOutputPathResolver: RenderOutputPathResolver,
  ) {}

  public register(server: McpServer): void {
    server.registerTool(
      "generate_video_project",
      {
        description: "Render a confirmed V2 video project.",
        inputSchema: z.object({
          videoId: z.string().min(1),
          compositionId: z.string().min(1),
          outputPath: z.string().min(1),
        }),
      },
      async (input) => {
        await this.renderOutputPathResolver.ensureDirectory();
        const render = await this.generateVideoProjectUseCase.execute({
          ...input,
          outputPath: this.renderOutputPathResolver.resolve(input.outputPath),
        });
        await this.renderResultStore.save(render);
        return {
          content: [{ type: "text", text: JSON.stringify(render) }],
        };
      },
    );
  }

}
