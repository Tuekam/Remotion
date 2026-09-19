export type VoiceOverStatus =
  | "draft"
  | "script-ready"
  | "generating"
  | "generated"
  | "validated"
  | "invalid";

/** Contrat des données VoiceSegment utilisé dans le domaine vidéo. */
export interface VoiceSegment {
  id: string;
  text: string;
  startMs: number;
  endMs: number;
  durationMs: number;
  sceneId: string | null;
}

/** Contrat des données VoiceAlignmentCharacter utilisé dans le domaine vidéo. */
export interface VoiceAlignmentCharacter {
  character: string;
  startMs: number;
  durationMs: number;
}

/** Contrat des données VoiceOverAlignment utilisé dans le domaine vidéo. */
export interface VoiceOverAlignment {
  characters: VoiceAlignmentCharacter[];
  source: "provider" | "estimated";
}

/** Contrat des données VoiceOver utilisé dans le domaine vidéo. */
export interface VoiceOver {
  id: string;
  videoId: string;
  provider: string;
  model: string;
  voiceId: string;
  language: string;
  script: string;
  audioPath: string;
  durationMs: number | null;
  alignment: VoiceOverAlignment | null;
  segments: VoiceSegment[];
  generationFingerprint: string;
  status: VoiceOverStatus;
  createdAt: Date;
  updatedAt: Date;
}
