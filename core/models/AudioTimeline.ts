import type { Music } from "./Music.js";
import type { VoiceOver, VoiceSegment } from "./VoiceOver.js";

export interface AudioTimeline {
  id: string;
  videoId: string;
  durationMs: number;
  voiceOver: VoiceOver;
  voiceSegments: VoiceSegment[];
  musicTracks: Music[];
  createdAt: Date;
  updatedAt: Date;
}
