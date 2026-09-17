import type { AudioTimeline } from "../../../core/models/AudioTimeline.js";
import type { AudioTimelineRepository } from "../../../core/repository/AudioTimelineRepository.js";
import { LocalVideoProjectStore } from "../database/LocalVideoProjectStore.js";

export class AudioTimelineRepositoryImpl implements AudioTimelineRepository {
  public constructor(
    private readonly localVideoProjectStore: LocalVideoProjectStore,
  ) {}

  public create(timeline: AudioTimeline): Promise<AudioTimeline> {
    return this.localVideoProjectStore.createAudioTimeline(timeline);
  }

  public getByVideoId(videoId: string): Promise<AudioTimeline | null> {
    return this.localVideoProjectStore.getAudioTimeline(videoId);
  }

  public update(timeline: AudioTimeline): Promise<AudioTimeline> {
    return this.localVideoProjectStore.updateAudioTimeline(timeline);
  }
}
