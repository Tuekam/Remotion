import {
  mkdir,
  readFile,
  readdir,
  rm,
  stat,
  writeFile,
} from "node:fs/promises";
import { dirname } from "node:path";
import type { WorkspaceManager } from "../video-engine/contracts/WorkspaceManager.js";

export interface WorkspaceEntry {
  name: string;
  type: "file" | "directory";
}

export class WorkspaceFileService {
  public constructor(private readonly workspaceManager: WorkspaceManager) {}

  public async inspectDirectory(
    videoId: string,
    relativePath = "",
  ): Promise<WorkspaceEntry[]> {
    const directoryPath = this.workspaceManager.resolvePath(videoId, relativePath);
    const entries = await readdir(directoryPath, { withFileTypes: true });
    return entries.map((entry) => ({
      name: entry.name,
      type: entry.isDirectory() ? "directory" : "file",
    }));
  }

  public read(videoId: string, relativePath: string): Promise<string> {
    return readFile(
      this.workspaceManager.resolvePath(videoId, relativePath),
      "utf8",
    );
  }

  public async write(
    videoId: string,
    relativePath: string,
    content: string,
  ): Promise<void> {
    const filePath = this.workspaceManager.resolvePath(videoId, relativePath);
    await mkdir(dirname(filePath), { recursive: true });
    await writeFile(filePath, content, "utf8");
  }

  public async update(
    videoId: string,
    relativePath: string,
    content: string,
  ): Promise<void> {
    const filePath = this.workspaceManager.resolvePath(videoId, relativePath);
    const fileStats = await stat(filePath);
    if (!fileStats.isFile()) {
      throw new Error(`Path is not a file: ${relativePath}`);
    }
    await writeFile(filePath, content, "utf8");
  }

  public async createDirectory(
    videoId: string,
    relativePath: string,
  ): Promise<void> {
    await mkdir(this.workspaceManager.resolvePath(videoId, relativePath), {
      recursive: true,
    });
  }

  public async delete(
    videoId: string,
    relativePath: string,
  ): Promise<void> {
    const targetPath = this.workspaceManager.resolvePath(videoId, relativePath);
    const workspace = await this.workspaceManager.get(videoId);
    if (targetPath === workspace.path) {
      throw new Error("The workspace root cannot be deleted");
    }
    await rm(targetPath, { recursive: true, force: false });
  }

  public inspectAsset(videoId: string, relativePath: string) {
    return stat(this.workspaceManager.resolvePath(videoId, relativePath));
  }
}
