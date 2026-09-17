export interface RenderVideoInput {
  videoId: string;
  compositionId: string;
  outputPath: string;
  inputProps?: Record<string, unknown>;
}
