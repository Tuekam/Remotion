import { z } from "zod";
import { mkdir } from "node:fs/promises";
import { isAbsolute, relative, resolve, sep } from "node:path";
import type { McpServer } from "@modelcontextprotocol/server";
import type { RenderVideoInput } from "../../video-engine/models/RenderVideoInput.js";
import type { VideoEngine } from "../../video-engine/contracts/VideoEngine.js";
import { RenderResultStore } from "../RenderResultStore.js";

export class RenderVideoTool {
  public constructor(
    private readonly videoEngine: VideoEngine,
    private readonly renderResultStore: RenderResultStore,
    private readonly outputRoot: string,
  ) {}

  public register(server: McpServer): void {
    server.registerTool(
      "render_video",
      {
        description: "Render a Remotion composition from a video workspace.",
        inputSchema: z.object({
          videoId: z.string().min(1),
          compositionId: z.string().min(1),
          outputPath: z.string().min(1),
        }),
      },
      async (input: RenderVideoInput) => {
        await mkdir(this.outputRoot, { recursive: true });
        const render = await this.videoEngine.render({
          ...input,
          outputPath: this.resolveOutputPath(input.outputPath),
        });
        await this.renderResultStore.save(render);
        return {
          content: [{ type: "text", text: JSON.stringify(render) }],
        };
      },
    );
  }

  private resolveOutputPath(outputPath: string): string {
    const normalizedPath = outputPath.replaceAll("\\", "/");
    if (!normalizedPath.startsWith("output/")) {
      throw new Error("Render output must be inside the repository output directory");
    }

    const targetPath = resolve(this.outputRoot, normalizedPath.slice("output/".length));
    const pathFromOutput = relative(this.outputRoot, targetPath);
    if (
      isAbsolute(pathFromOutput) ||
      pathFromOutput === ".." ||
      pathFromOutput.startsWith(`..${sep}`)
    ) {
      throw new Error("Render output path escapes the repository output directory");
    }

    return targetPath;
  }
}
