import type { Music } from "../../../../core/models/Music.js";

export interface PrepareMusicRequest {
  videoId: string;
  assetId: string;
  assetPath: string;
  durationMs: number;
  finalDurationMs: number;
  volume?: number;
  fadeInMs?: number;
  fadeOutMs?: number;
  loop?: boolean;
  ducking?: Partial<Music["ducking"]>;
}

export interface MusicService {
  prepare(request: PrepareMusicRequest): Promise<Music>;
}
