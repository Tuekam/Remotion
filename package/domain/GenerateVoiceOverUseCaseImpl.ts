import type { VoiceOver } from "../../core/models/VoiceOver.js";
import type { GenerateVoiceOverUseCase } from "../../core/use-case/GenerateVoiceOverUseCase.js";
import type { GenerateVoiceOverRequest } from "../../core/use-case/GenerateVoiceOverUseCase.js";
import { VoiceServiceImpl } from "../services/audio/voice/VoiceServiceImpl.js";

/** Orchestre les opérations du composant GenerateVoiceOverUseCaseImpl dans le flux applicatif. */
export class GenerateVoiceOverUseCaseImpl implements GenerateVoiceOverUseCase {
/** Initialise l’instance avec les dépendances injectées nécessaires à son rôle. */
  public constructor(private readonly voiceService: VoiceServiceImpl) {}

  /** Delegue la generation de la voix au service audio injecte. */
  public execute(input: GenerateVoiceOverRequest): Promise<VoiceOver> {
    return this.voiceService.generate(input);
  }
}
