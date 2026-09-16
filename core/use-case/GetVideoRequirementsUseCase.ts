import type { VideoTypeDefinition, VideoTypeId } from "../models/VideoType.js";

export interface GetVideoRequirementsUseCase {
  execute(videoType: VideoTypeId): Promise<VideoTypeDefinition>;
}
