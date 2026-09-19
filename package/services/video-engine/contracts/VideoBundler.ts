/** Contrat des données VideoBundleInput utilisé dans le domaine vidéo. */
export interface VideoBundleInput {
  entryPoint: string;
  publicDir: string;
}

/** Contrat des données VideoBundle utilisé dans le domaine vidéo. */
export interface VideoBundle {
  serveUrl: string;
}

/** Contrat des données VideoBundler utilisé dans le domaine vidéo. */
export interface VideoBundler {
  bundle(input: VideoBundleInput): Promise<VideoBundle>;
}
