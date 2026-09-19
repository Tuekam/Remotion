import { mkdir } from "node:fs/promises";
import { isAbsolute, relative, resolve, sep } from "node:path";

/** Valide et convertit les chemins de rendu reçus par MCP vers le dossier output autorisé. */
export class RenderOutputPathResolver {
/** Initialise l’instance avec les dépendances injectées nécessaires à son rôle. */
  public constructor(private readonly outputRoot: string) {}

/** Réalise l’opération ensureDirectory sur les données reçues et retourne le résultat attendu. */
  public async ensureDirectory(): Promise<void> {
    await mkdir(this.outputRoot, { recursive: true });
  }

/** Réalise l’opération resolve sur les données reçues et retourne le résultat attendu. */
  public resolve(outputPath: string): string {
    const normalizedPath = outputPath.replaceAll("\\", "/");
    if (!normalizedPath.startsWith("output/")) {
      throw new Error("Render output must be inside the repository output directory");
    }
    const targetPath = resolve(
      this.outputRoot,
      normalizedPath.slice("output/".length),
    );
    const pathFromOutput = relative(this.outputRoot, targetPath);
    if (
      isAbsolute(pathFromOutput) ||
      pathFromOutput === ".." ||
      pathFromOutput.startsWith(`..${sep}`)
    ) {
      throw new Error("Render output path escapes the repository output directory");
    }
    return targetPath;
  }
}
