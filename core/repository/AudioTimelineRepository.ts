import type { AudioTimeline } from "../models/AudioTimeline.js";

/** Contrat des données AudioTimelineRepository utilisé dans le domaine vidéo. */
export interface AudioTimelineRepository {
  create(timeline: AudioTimeline): Promise<AudioTimeline>;
  getByVideoId(videoId: string): Promise<AudioTimeline | null>;
  update(timeline: AudioTimeline): Promise<AudioTimeline>;
}
