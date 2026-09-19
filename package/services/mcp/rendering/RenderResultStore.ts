import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import type { Render } from "../../../../core/models/Render.js";

type StoredRender = Omit<Render, "startedAt" | "completedAt"> & {
  startedAt: string | null;
  completedAt: string | null;
};

/** Orchestre les opérations du composant RenderResultStore dans le flux applicatif. */
export class RenderResultStore {
/** Initialise l’instance avec les dépendances injectées nécessaires à son rôle. */
  public constructor(private readonly renderStorePath: string) {}

/** Réalise l’opération save sur les données reçues et retourne le résultat attendu. */
  public async save(render: Render): Promise<void> {
    const renders = await this.readAll();
    const index = renders.findIndex((item) => item.id === render.id);
    if (index === -1) {
      renders.push(render);
    } else {
      renders[index] = render;
    }
    await this.writeAll(renders);
  }

/** Récupère la ressource demandée et signale son absence selon le contrat du service. */
  public async get(id: string): Promise<Render | null> {
    const renders = await this.readAll();
    return renders.find((render) => render.id === id) ?? null;
  }

  private async readAll(): Promise<Render[]> {
    try {
      const content = await readFile(this.renderStorePath, "utf8");
      const storedRenders: StoredRender[] = JSON.parse(content) as StoredRender[];
      return storedRenders.map((render) => ({
        ...render,
        startedAt: render.startedAt ? new Date(render.startedAt) : null,
        completedAt: render.completedAt ? new Date(render.completedAt) : null,
      }));
    } catch (error) {
      if (isFileNotFoundError(error)) {
        return [];
      }
      throw error;
    }
  }

  private async writeAll(renders: Render[]): Promise<void> {
    await mkdir(dirname(this.renderStorePath), { recursive: true });
    await writeFile(this.renderStorePath, JSON.stringify(renders, null, 2), "utf8");
  }
}

/** Identifie une erreur système signalant qu’un fichier ou répertoire n’existe pas. */
function isFileNotFoundError(error: unknown): error is NodeJS.ErrnoException {
  return (
    error instanceof Error &&
    "code" in error &&
    (error as NodeJS.ErrnoException).code === "ENOENT"
  );
}
