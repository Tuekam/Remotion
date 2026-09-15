export type VideoStatus =
  | "draft"
  | "generating"
  | "executing"
  | "rendering"
  | "completed"
  | "failed";

export interface Video {
  id: string;
  prompt: string;
  status: VideoStatus;
  workspacePath: string;
  outputPath: string | null;
  duration: number | null;
  width: number | null;
  height: number | null;
  fps: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateVideoInput {
  id: string;
  prompt: string;
  workspacePath: string;
  duration?: number | null;
  width?: number | null;
  height?: number | null;
  fps?: number | null;
}

export interface UpdateVideoInput {
  prompt?: string;
  status?: VideoStatus;
  outputPath?: string | null;
  duration?: number | null;
  width?: number | null;
  height?: number | null;
  fps?: number | null;
}
