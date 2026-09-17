export interface MusicDucking {
  enabled: boolean;
  volumeDuringVoice: number;
  attackMs: number;
  releaseMs: number;
}

export interface Music {
  id: string;
  videoId: string;
  assetId: string;
  path: string;
  durationMs: number | null;
  startMs: number;
  endMs: number | null;
  volume: number;
  fadeInMs: number;
  fadeOutMs: number;
  loop: boolean;
  ducking: MusicDucking;
}
