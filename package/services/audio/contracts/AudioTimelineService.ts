import type { AudioTimeline } from "../../../../core/models/AudioTimeline.js";
import type { Music } from "../../../../core/models/Music.js";
import type { VoiceOver } from "../../../../core/models/VoiceOver.js";

export interface CreateAudioTimelineRequest {
  videoId: string;
  voiceOver: VoiceOver;
  musicTracks?: Music[];
  fps: number;
  durationTargetMs?: number;
}

export interface AudioTimelineResult {
  timeline: AudioTimeline;
  voiceDurationInFrames: number;
  finalDurationInFrames: number;
}

export interface AudioTimelineService {
  create(request: CreateAudioTimelineRequest): AudioTimelineResult;
}
