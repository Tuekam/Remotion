import {
  mkdir,
  readFile,
  readdir,
  rm,
  stat,
  writeFile,
} from "node:fs/promises";
import { dirname } from "node:path";
import type { WorkspaceManager } from "../../../../core/service/WorkspaceManager.js";
import type { WorkspaceEntry } from "../contracts/WorkspaceServices.js";

/** Orchestre les opérations du composant WorkspaceFileService dans le flux applicatif. */
export class WorkspaceFileService {
/** Initialise l’instance avec les dépendances injectées nécessaires à son rôle. */
  public constructor(private readonly workspaceManager: WorkspaceManager) {}

/** Réalise l’opération inspectDirectory sur les données reçues et retourne le résultat attendu. */
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

  /** Lit un tableau JSON depuis le chemin fourni; crée le fichier et son dossier avec un tableau vide s’ils manquent. */
  public read(videoId: string, relativePath: string): Promise<string> {
    return readFile(
      this.workspaceManager.resolvePath(videoId, relativePath),
      "utf8",
    );
  }

  /** Sérialise un tableau de modèles persistés en JSON et l’écrit dans le fichier cible. */
  public async write(
    videoId: string,
    relativePath: string,
    content: string,
  ): Promise<void> {
    const filePath = this.workspaceManager.resolvePath(videoId, relativePath);
    await mkdir(dirname(filePath), { recursive: true });
    await writeFile(filePath, content, "utf8");
  }

/** Met à jour la ressource métier existante à partir des données reçues. */
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

/** Crée et persiste la ressource métier correspondant aux données reçues. */
  public async createDirectory(
    videoId: string,
    relativePath: string,
  ): Promise<void> {
    await mkdir(this.workspaceManager.resolvePath(videoId, relativePath), {
      recursive: true,
    });
  }

/** Supprime la ressource ciblée après validation de son identifiant. */
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

/** Réalise l’opération inspectAsset sur les données reçues et retourne le résultat attendu. */
  public inspectAsset(videoId: string, relativePath: string) {
    return stat(this.workspaceManager.resolvePath(videoId, relativePath));
  }
}
