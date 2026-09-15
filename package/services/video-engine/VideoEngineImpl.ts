import { randomUUID } from "node:crypto";
import { join } from "node:path";
import type { Render } from "../../../core/models/Render.js";
import type { RenderVideoInput } from "./models/RenderVideoInput.js";
import type { VideoWorkspace } from "./models/VideoWorkspace.js";
import type { VideoBundler } from "./contracts/VideoBundler.js";
import type { VideoEngine } from "./contracts/VideoEngine.js";
import type { VideoRenderer } from "./contracts/VideoRenderer.js";
import type { WorkspaceManager } from "./contracts/WorkspaceManager.js";

export class VideoEngineImpl implements VideoEngine {
  public constructor(
    private readonly workspaceManager: WorkspaceManager,
    private readonly videoBundler: VideoBundler,
    private readonly videoRenderer: VideoRenderer,
  ) {}

  public getWorkspace(videoId: string): Promise<VideoWorkspace> {
    return this.workspaceManager.get(videoId);
  }

  public async execute(videoId: string): Promise<void> {
    await this.bundleWorkspace(videoId);
  }

  public async render(input: RenderVideoInput): Promise<Render> {
    const renderId = randomUUID();
    const startedAt = new Date();

    try {
      const { serveUrl } = await this.bundleWorkspace(input.videoId);
      await this.videoRenderer.render(input, { serveUrl });

      return {
        id: renderId,
        videoId: input.videoId,
        status: "completed",
        outputPath: input.outputPath,
        startedAt,
        completedAt: new Date(),
        error: null,
      };
    } catch (error: unknown) {
      return {
        id: renderId,
        videoId: input.videoId,
        status: "failed",
        outputPath: null,
        startedAt,
        completedAt: new Date(),
        error: toErrorMessage(error),
      };
    }
  }

  private async bundleWorkspace(
    videoId: string,
  ): Promise<{ serveUrl: string }> {
    const workspace = await this.workspaceManager.get(videoId);
    const entryPoint = join(workspace.path, "composition", "MainVideo.tsx");
    return this.videoBundler.bundle({ entryPoint });
  }
}

function toErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
