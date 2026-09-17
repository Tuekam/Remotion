export interface VideoBundleInput {
  entryPoint: string;
  publicDir: string;
}

export interface VideoBundle {
  serveUrl: string;
}

export interface VideoBundler {
  bundle(input: VideoBundleInput): Promise<VideoBundle>;
}
