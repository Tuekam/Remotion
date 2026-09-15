import type { Render } from "../../../core/models/Render.js";

export class RenderResultStore {
  private readonly renders = new Map<string, Render>();

  public save(render: Render): void {
    this.renders.set(render.id, render);
  }

  public get(id: string): Render | null {
    return this.renders.get(id) ?? null;
  }
}
