export interface VideoBundleInput {
  entryPoint: string;
}

export interface VideoBundle {
  serveUrl: string;
}

export interface VideoBundler {
  bundle(input: VideoBundleInput): Promise<VideoBundle>;
}
