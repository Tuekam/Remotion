import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import type { Render } from "../../../core/models/Render.js";

type StoredRender = Omit<Render, "startedAt" | "completedAt"> & {
  startedAt: string | null;
  completedAt: string | null;
};

export class RenderResultStore {
  public constructor(private readonly renderStorePath: string) {}

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

function isFileNotFoundError(error: unknown): error is NodeJS.ErrnoException {
  return (
    error instanceof Error &&
    "code" in error &&
    (error as NodeJS.ErrnoException).code === "ENOENT"
  );
}
