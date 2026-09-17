import { readFile } from "node:fs/promises";
import type { VoiceOverRepository } from "../../core/repository/VoiceOverRepository.js";
import type { VoiceOver } from "../../core/models/VoiceOver.js";
import type { GetVoiceOverUseCase } from "../../core/use-case/GetVoiceOverUseCase.js";
import { measureMp3DurationMs } from "../services/audio/voice/ElevenLabsClientImpl.js";
import type { WorkspaceManager } from "../services/video-engine/contracts/WorkspaceManager.js";

export class GetVoiceOverUseCaseImpl implements GetVoiceOverUseCase {
  public constructor(
    private readonly voiceOverRepository: VoiceOverRepository,
    private readonly workspaceManager: WorkspaceManager,
  ) {}

  public async execute(videoId: string): Promise<VoiceOver> {
    const voiceOver = await this.voiceOverRepository.getByVideoId(videoId);
    if (!voiceOver) {
      throw new Error(`Voice-over not found: ${videoId}`);
    }
    if (voiceOver.durationMs === null) {
      const audio = await readFile(
        this.workspaceManager.resolvePath(videoId, voiceOver.audioPath),
      );
      const durationMs = measureMp3DurationMs(audio);
      if (durationMs !== null) {
        const repairedVoiceOver: VoiceOver = {
          ...voiceOver,
          durationMs,
          updatedAt: new Date(),
        };
        return this.voiceOverRepository.update(repairedVoiceOver);
      }
    }
    return voiceOver;
  }
}
