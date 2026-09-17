import type { VoiceOver } from "../../core/models/VoiceOver.js";
import type { GenerateVoiceOverUseCase } from "../../core/use-case/GenerateVoiceOverUseCase.js";
import type { GenerateVoiceOverRequest, VoiceService } from "../services/audio/voice/contracts/VoiceService.js";

export class GenerateVoiceOverUseCaseImpl implements GenerateVoiceOverUseCase {
  public constructor(private readonly voiceService: VoiceService) {}

  public execute(input: GenerateVoiceOverRequest): Promise<VoiceOver> {
    return this.voiceService.generate(input);
  }
}
