import type { VideoBrief } from "../../../core/models/VideoBrief.js";
import type { VideoBriefRepository } from "../../../core/repository/VideoBriefRepository.js";
import { LocalVideoProjectStore } from "../database/LocalVideoProjectStore.js";

export class VideoBriefRepositoryImpl implements VideoBriefRepository {
  public constructor(private readonly localVideoProjectStore: LocalVideoProjectStore) {}

  public create(brief: VideoBrief): Promise<VideoBrief> {
    return this.localVideoProjectStore.createBrief(brief);
  }

  public getByVideoId(videoId: string): Promise<VideoBrief | null> {
    return this.localVideoProjectStore.getBrief(videoId);
  }

  public update(brief: VideoBrief): Promise<VideoBrief> {
    return this.localVideoProjectStore.updateBrief(brief);
  }
}
