import type { VideoWorkspace } from "../../../core/models/VideoWorkspace.js";

export interface WorkspaceManager {
  create(videoId: string): Promise<VideoWorkspace>;
  get(videoId: string): Promise<VideoWorkspace>;
  resolvePath(videoId: string, requestedPath?: string): string;
}
