import { mkdir } from "node:fs/promises";
import { isAbsolute, relative, resolve, sep } from "node:path";

export class RenderOutputPathResolver {
  public constructor(private readonly outputRoot: string) {}

  public async ensureDirectory(): Promise<void> {
    await mkdir(this.outputRoot, { recursive: true });
  }

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
