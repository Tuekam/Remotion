import type { VideoWorkspace } from "../models/VideoWorkspace.js";

/**
 * Fournit l'abstraction commune de création, lecture et résolution des
 * workspaces utilisés par le domaine, les services techniques et le moteur vidéo.
 */
export interface WorkspaceManager {
  /** Crée le workspace isolé d'une vidéo et retourne ses informations d'accès. */
  create(videoId: string): Promise<VideoWorkspace>;

  /** Charge les informations du workspace existant d'une vidéo. */
  get(videoId: string): Promise<VideoWorkspace>;

  /** Transforme un chemin relatif en chemin sécurisé à l'intérieur du workspace. */
  resolvePath(videoId: string, requestedPath?: string): string;
}
