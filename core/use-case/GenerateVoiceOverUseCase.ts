import type { VoiceOver } from "../models/VoiceOver.js";
import type { GenerateVoiceOverRequest } from "../../package/services/audio/voice/contracts/VoiceService.js";

export interface GenerateVoiceOverUseCase {
  execute(input: GenerateVoiceOverRequest): Promise<VoiceOver>;
}
