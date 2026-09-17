import { randomUUID } from "node:crypto";
import { access, cp, mkdir, rm } from "node:fs/promises";
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
    const bundle = await this.bundleWorkspace(videoId);
    try {
      return;
    } finally {
      await bundle.cleanup();
    }
  }

  public async render(input: RenderVideoInput): Promise<Render> {
    const renderId = randomUUID();
    const startedAt = new Date();

    try {
      const bundle = await this.bundleWorkspace(input.videoId);
      try {
        await this.videoRenderer.render(input, { serveUrl: bundle.serveUrl });
      } finally {
        await bundle.cleanup();
      }

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
  ): Promise<{ serveUrl: string; cleanup: () => Promise<void> }> {
    const workspace = await this.workspaceManager.get(videoId);
    const publicDir = join(
      workspace.path,
      ".render-public",
      randomUUID(),
    );
    await this.preparePublicDirectory(workspace.path, publicDir);
    try {
      const entryPoint = join(workspace.path, "composition", "MainVideo.tsx");
      const bundle = await this.videoBundler.bundle({ entryPoint, publicDir });
      return {
        ...bundle,
        cleanup: () => rm(publicDir, { recursive: true, force: true }),
      };
    } catch (error) {
      await rm(publicDir, { recursive: true, force: true });
      throw error;
    }
  }

  private async preparePublicDirectory(
    workspacePath: string,
    publicDir: string,
  ): Promise<void> {
    await mkdir(publicDir, { recursive: true });
    await copyDirectoryIfPresent(
      join(workspacePath, "assets"),
      join(publicDir, "assets"),
    );
    await copyDirectoryIfPresent(
      join(workspacePath, "audio"),
      join(publicDir, "audio"),
    );
  }
}

function toErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

async function copyDirectoryIfPresent(
  sourcePath: string,
  targetPath: string,
): Promise<void> {
  try {
    await access(sourcePath);
  } catch (error) {
    if (isFileNotFoundError(error)) {
      return;
    }
    throw error;
  }
  await cp(sourcePath, targetPath, { recursive: true, force: true });
}

function isFileNotFoundError(error: unknown): error is NodeJS.ErrnoException {
  return (
    error instanceof Error &&
    "code" in error &&
    (error as NodeJS.ErrnoException).code === "ENOENT"
  );
}
