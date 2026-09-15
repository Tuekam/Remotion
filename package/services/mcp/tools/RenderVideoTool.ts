import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/server";
import type { RenderVideoInput } from "../../video-engine/models/RenderVideoInput.js";
import type { VideoEngine } from "../../video-engine/contracts/VideoEngine.js";
import type { WorkspaceManager } from "../../video-engine/contracts/WorkspaceManager.js";
import { RenderResultStore } from "../RenderResultStore.js";

export class RenderVideoTool {
  public constructor(
    private readonly videoEngine: VideoEngine,
    private readonly renderResultStore: RenderResultStore,
    private readonly workspaceManager: WorkspaceManager,
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
        const render = await this.videoEngine.render({
          ...input,
          outputPath: this.workspaceManager.resolvePath(
            input.videoId,
            input.outputPath,
          ),
        });
        this.renderResultStore.save(render);
        return {
          content: [{ type: "text", text: JSON.stringify(render) }],
        };
      },
    );
  }
}
