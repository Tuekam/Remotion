export type VoiceOverStatus =
  | "draft"
  | "script-ready"
  | "generating"
  | "generated"
  | "validated"
  | "invalid";

export interface VoiceSegment {
  id: string;
  text: string;
  startMs: number;
  endMs: number;
  durationMs: number;
  sceneId: string | null;
}

export interface VoiceAlignmentCharacter {
  character: string;
  startMs: number;
  durationMs: number;
}

export interface VoiceOverAlignment {
  characters: VoiceAlignmentCharacter[];
  source: "provider" | "estimated";
}

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
