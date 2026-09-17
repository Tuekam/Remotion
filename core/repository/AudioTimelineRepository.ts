import type { AudioTimeline } from "../models/AudioTimeline.js";

export interface AudioTimelineRepository {
  create(timeline: AudioTimeline): Promise<AudioTimeline>;
  getByVideoId(videoId: string): Promise<AudioTimeline | null>;
  update(timeline: AudioTimeline): Promise<AudioTimeline>;
}
