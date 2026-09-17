import { randomUUID } from "node:crypto";
import { access } from "node:fs/promises";
import type { Music } from "../../../../core/models/Music.js";
import type { MusicService, PrepareMusicRequest } from "./contracts/MusicService.js";
import type { WorkspaceManager } from "../../video-engine/contracts/WorkspaceManager.js";

export class MusicServiceImpl implements MusicService {
  public constructor(private readonly workspaceManager: WorkspaceManager) {}

  public async prepare(request: PrepareMusicRequest): Promise<Music> {
    validateRequest(request);
    const path = this.workspaceManager.resolvePath(
      request.videoId,
      request.assetPath,
    );
    await assertFileExists(path);

    const finalDurationMs = request.finalDurationMs;
    const musicDurationMs = request.durationMs;
    const fadeOutMs = Math.min(
      request.fadeOutMs ?? 500,
      finalDurationMs,
      musicDurationMs,
    );

    return {
      id: randomUUID(),
      videoId: request.videoId,
      assetId: request.assetId,
      path: request.assetPath,
      durationMs: musicDurationMs,
      startMs: 0,
      endMs: finalDurationMs,
      volume: request.volume ?? 0.25,
      fadeInMs: Math.min(request.fadeInMs ?? 300, finalDurationMs),
      fadeOutMs,
      loop: request.loop ?? musicDurationMs < finalDurationMs,
      ducking: {
        enabled: request.ducking?.enabled ?? true,
        volumeDuringVoice: request.ducking?.volumeDuringVoice ?? 0.08,
        attackMs: request.ducking?.attackMs ?? 120,
        releaseMs: request.ducking?.releaseMs ?? 250,
      },
    };
  }
}

function validateRequest(request: PrepareMusicRequest): void {
  if (request.videoId.trim().length === 0) {
    throw new Error("Video ID must not be empty");
  }
  if (request.assetId.trim().length === 0) {
    throw new Error("Music asset ID must not be empty");
  }
  if (request.assetPath.trim().length === 0) {
    throw new Error("Music asset path must not be empty");
  }
  if (!Number.isFinite(request.durationMs) || request.durationMs <= 0) {
    throw new Error("Music duration must be greater than zero");
  }
  if (
    !Number.isFinite(request.finalDurationMs) ||
    request.finalDurationMs <= 0
  ) {
    throw new Error("Final duration must be greater than zero");
  }
  validateVolume(request.volume ?? 0.25, "Music volume");
  validateVolume(
    request.ducking?.volumeDuringVoice ?? 0.08,
    "Ducking volume",
  );
}

function validateVolume(value: number, label: string): void {
  if (!Number.isFinite(value) || value < 0 || value > 1) {
    throw new Error(`${label} must be between 0 and 1`);
  }
}

async function assertFileExists(path: string): Promise<void> {
  try {
    await access(path);
  } catch (error) {
    if (isFileNotFoundError(error)) {
      throw new Error(`Music asset not found: ${path}`);
    }
    throw error;
  }
}

function isFileNotFoundError(error: unknown): error is NodeJS.ErrnoException {
  return (
    error instanceof Error &&
    "code" in error &&
    (error as NodeJS.ErrnoException).code === "ENOENT"
  );
}
