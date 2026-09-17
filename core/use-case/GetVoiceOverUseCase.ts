import type { VoiceOver } from "../models/VoiceOver.js";

export interface GetVoiceOverUseCase {
  execute(videoId: string): Promise<VoiceOver>;
}
