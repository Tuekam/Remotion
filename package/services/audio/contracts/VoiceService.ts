import type { VoiceOver } from "../../../../core/models/VoiceOver.js";
import type { GenerateVoiceOverRequest } from "../../../../core/use-case/GenerateVoiceOverUseCase.js";

export type { GenerateVoiceOverRequest };

export interface VoiceService {
  generate(request: GenerateVoiceOverRequest): Promise<VoiceOver>;
}
