import { access, mkdir } from "node:fs/promises";
import { isAbsolute, join, relative, resolve, sep } from "node:path";
import type { VideoWorkspace } from "../models/VideoWorkspace.js";
import type { WorkspaceManager } from "../contracts/WorkspaceManager.js";

export class WorkspaceManagerImpl implements WorkspaceManager {
  private readonly rootPath: string;

  public constructor(workspaceRoot: string) {
    this.rootPath = resolve(workspaceRoot);
  }

  public async create(videoId: string): Promise<VideoWorkspace> {
    const workspacePath = this.resolveVideoPath(videoId);
    await mkdir(workspacePath, { recursive: true });
    return { videoId, path: workspacePath };
  }

  public async get(videoId: string): Promise<VideoWorkspace> {
    const workspacePath = this.resolveVideoPath(videoId);
    await access(workspacePath);
    return { videoId, path: workspacePath };
  }

  public resolvePath(videoId: string, requestedPath = ""): string {
    const workspacePath = this.resolveVideoPath(videoId);
    const targetPath = resolve(workspacePath, requestedPath);
    const pathFromWorkspace = relative(workspacePath, targetPath);

    if (
      pathFromWorkspace === ".." ||
      pathFromWorkspace.startsWith(`..${sep}`) ||
      isAbsolute(pathFromWorkspace)
    ) {
      throw new Error("Workspace path escapes the video workspace");
    }

    return targetPath;
  }

  private resolveVideoPath(videoId: string): string {
    if (videoId.length === 0 || videoId.includes("/") || videoId.includes("\\")) {
      throw new Error("Invalid video id");
    }

    return join(this.rootPath, videoId);
  }
}
