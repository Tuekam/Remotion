import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import type {
  CreateVideoInput,
  UpdateVideoInput,
  Video,
} from "../../../core/models/Video.js";

type StoredVideo = Omit<Video, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};

export class LocalVideoStore {
  public constructor(private readonly videoStorePath: string) {}

  public async create(input: CreateVideoInput): Promise<Video> {
    const videos = await this.readAll();
    if (videos.some((video) => video.id === input.id)) {
      throw new Error(`Video already exists: ${input.id}`);
    }

    const now = new Date();
    const video: Video = {
      id: input.id,
      prompt: input.prompt,
      status: "draft",
      workspacePath: input.workspacePath,
      outputPath: null,
      duration: input.duration ?? null,
      width: input.width ?? null,
      height: input.height ?? null,
      fps: input.fps ?? null,
      createdAt: now,
      updatedAt: now,
    };

    await this.writeAll([...videos, video]);
    return video;
  }

  public async getById(id: string): Promise<Video | null> {
    const videos = await this.readAll();
    return videos.find((video) => video.id === id) ?? null;
  }

  public async update(
    id: string,
    input: UpdateVideoInput,
  ): Promise<Video | null> {
    const videos = await this.readAll();
    const index = videos.findIndex((video) => video.id === id);
    if (index === -1) {
      return null;
    }

    const current = videos[index];
    if (!current) {
      return null;
    }

    const updated: Video = {
      ...current,
      ...input,
      updatedAt: new Date(),
    };
    videos[index] = updated;
    await this.writeAll(videos);
    return updated;
  }

  public async delete(id: string): Promise<boolean> {
    const videos = await this.readAll();
    const remaining = videos.filter((video) => video.id !== id);
    if (remaining.length === videos.length) {
      return false;
    }

    await this.writeAll(remaining);
    return true;
  }

  private async readAll(): Promise<Video[]> {
    try {
      const content = await readFile(this.videoStorePath, "utf8");
      const storedVideos: StoredVideo[] = JSON.parse(content) as StoredVideo[];
      return storedVideos.map((video) => ({
        ...video,
        createdAt: new Date(video.createdAt),
        updatedAt: new Date(video.updatedAt),
      }));
    } catch (error) {
      if (isFileNotFoundError(error)) {
        return [];
      }
      throw error;
    }
  }

  private async writeAll(videos: Video[]): Promise<void> {
    await mkdir(dirname(this.videoStorePath), { recursive: true });
    await writeFile(
      this.videoStorePath,
      JSON.stringify(videos, null, 2),
      "utf8",
    );
  }
}

function isFileNotFoundError(error: unknown): error is NodeJS.ErrnoException {
  return (
    error instanceof Error &&
    "code" in error &&
    (error as NodeJS.ErrnoException).code === "ENOENT"
  );
}
