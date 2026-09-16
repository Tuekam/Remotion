import type { VideoTypeId } from "./VideoType.js";

export interface VideoPlanScene {
  title: string;
  objective: string;
  message: string;
  assetIds: string[];
  estimatedDurationInSeconds: number;
}

export interface VideoPlan {
  id: string;
  videoId: string;
  videoType: VideoTypeId;
  summary: string;
  narrative: string;
  callToAction: string | null;
  visualDirection: string;
  scenes: VideoPlanScene[];
  createdAt: Date;
  updatedAt: Date;
}
