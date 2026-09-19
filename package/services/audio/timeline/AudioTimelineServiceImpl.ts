import { randomUUID } from "node:crypto";
import type { AudioTimeline } from "../../../../core/models/AudioTimeline.js";
import type {
  AudioTimelineResult,
  AudioTimelineService,
  CreateAudioTimelineRequest,
} from "../contracts/AudioTimelineService.js";

export class AudioTimelineServiceImpl implements AudioTimelineService {
  /** Aligns voice and music tracks on the shared frame timeline. */
  public create(request: CreateAudioTimelineRequest): AudioTimelineResult {
    validateRequest(request);

    const voiceDurationMs = request.voiceOver.durationMs ?? 0;
    if (voiceDurationMs <= 0) {
      throw new Error("Voice-over duration is required to create an audio timeline");
    }

    const musicTracks = request.musicTracks ?? [];
    const durationMs = Math.max(
      voiceDurationMs,
      request.durationTargetMs ?? 0,
      ...musicTracks
        .map((track) => track.endMs ?? 0)
        .filter((endMs) => endMs > 0),
    );
    if (request.voiceOver.segments.length === 0) {
      throw new Error(
        "Timestamped voice segments are required to create an audio timeline",
      );
    }
    const voiceSegments = request.voiceOver.segments;
    const now = new Date();
    const timeline: AudioTimeline = {
      id: randomUUID(),
      videoId: request.videoId,
      durationMs,
      voiceOver: {
        ...request.voiceOver,
        segments: voiceSegments,
      },
      voiceSegments,
      musicTracks,
      createdAt: now,
      updatedAt: now,
    };

    return {
      timeline,
      voiceDurationInFrames: secondsToFrames(voiceDurationMs / 1000, request.fps),
      finalDurationInFrames: secondsToFrames(durationMs / 1000, request.fps),
    };
  }
}

export function secondsToFrames(seconds: number, fps: number): number {
  if (!Number.isFinite(seconds) || seconds < 0) {
    throw new Error("Seconds must be a non-negative finite number");
  }
  if (!Number.isFinite(fps) || fps <= 0) {
    throw new Error("FPS must be greater than zero");
  }
  return Math.round(seconds * fps);
}

function validateRequest(request: CreateAudioTimelineRequest): void {
  if (request.videoId.trim().length === 0) {
    throw new Error("Video ID must not be empty");
  }
  if (!request.voiceOver.videoId || request.voiceOver.videoId !== request.videoId) {
    throw new Error("Voice-over must belong to the current video");
  }
  if (!Number.isFinite(request.fps) || request.fps <= 0) {
    throw new Error("FPS must be greater than zero");
  }
  for (const track of request.musicTracks ?? []) {
    if (track.videoId !== request.videoId) {
      throw new Error("Music track must belong to the current video");
    }
  }
}
