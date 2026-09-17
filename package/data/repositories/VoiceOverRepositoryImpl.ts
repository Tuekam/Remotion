import type { VoiceOver } from "../../../core/models/VoiceOver.js";
import type { VoiceOverRepository } from "../../../core/repository/VoiceOverRepository.js";
import { LocalVideoProjectStore } from "../database/LocalVideoProjectStore.js";

export class VoiceOverRepositoryImpl implements VoiceOverRepository {
  public constructor(
    private readonly localVideoProjectStore: LocalVideoProjectStore,
  ) {}

  public create(voiceOver: VoiceOver): Promise<VoiceOver> {
    return this.localVideoProjectStore.createVoiceOver(voiceOver);
  }

  public getByVideoId(videoId: string): Promise<VoiceOver | null> {
    return this.localVideoProjectStore.getVoiceOver(videoId);
  }

  public update(voiceOver: VoiceOver): Promise<VoiceOver> {
    return this.localVideoProjectStore.updateVoiceOver(voiceOver);
  }
}
