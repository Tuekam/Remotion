import type { VoiceOver } from "../../core/models/VoiceOver.js";
import type { GenerateVoiceOverUseCase } from "../../core/use-case/GenerateVoiceOverUseCase.js";
import type { GenerateVoiceOverRequest } from "../../core/use-case/GenerateVoiceOverUseCase.js";
import type { VoiceService } from "../services/audio/contracts/VoiceService.js";

export class GenerateVoiceOverUseCaseImpl implements GenerateVoiceOverUseCase {
  public constructor(private readonly voiceService: VoiceService) {}

  /** Delegates voice generation to the injected audio service. */
  public execute(input: GenerateVoiceOverRequest): Promise<VoiceOver> {
    return this.voiceService.generate(input);
  }
}
