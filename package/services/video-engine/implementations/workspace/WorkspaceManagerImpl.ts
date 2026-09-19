import { access, mkdir } from "node:fs/promises";
import { isAbsolute, join, relative, resolve, sep } from "node:path";
import type { VideoWorkspace } from "../../../../../core/models/VideoWorkspace.js";
import type { WorkspaceManager } from "../../../../../core/service/WorkspaceManager.js";

/** Orchestre les opérations du composant WorkspaceManagerImpl dans le flux applicatif. */
export class WorkspaceManagerImpl implements WorkspaceManager {
  private readonly rootPath: string;

/** Initialise l’instance avec les dépendances injectées nécessaires à son rôle. */
  public constructor(workspaceRoot: string) {
    this.rootPath = resolve(workspaceRoot);
  }

  /** Cree le repertoire isole utilise par un projet video. */
  public async create(videoId: string): Promise<VideoWorkspace> {
    const workspacePath = this.resolveVideoPath(videoId);
    await mkdir(workspacePath, { recursive: true });
    return { videoId, path: workspacePath };
  }

  /** Resout l'espace de travail video existant et echoue s'il est absent. */
  public async get(videoId: string): Promise<VideoWorkspace> {
    const workspacePath = this.resolveVideoPath(videoId);
    await access(workspacePath);
    return { videoId, path: workspacePath };
  }

  /** Resout un chemin en empechant tout acces hors de l'espace de travail video. */
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
