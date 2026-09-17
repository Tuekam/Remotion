import { createHash, randomUUID } from "node:crypto";
import { access, mkdir, writeFile } from "node:fs/promises";
import type { VoiceOver } from "../../../../core/models/VoiceOver.js";
import type { VoiceOverRepository } from "../../../../core/repository/VoiceOverRepository.js";
import type {
  ElevenLabsClient,
  ElevenLabsSynthesisRequest,
} from "./contracts/ElevenLabsClient.js";
import type {
  GenerateVoiceOverRequest,
  VoiceService,
} from "./contracts/VoiceService.js";
import type { WorkspaceManager } from "../../video-engine/contracts/WorkspaceManager.js";

const VOICE_AUDIO_PATH = "audio/voice-over.mp3";
const VOICE_METADATA_PATH = "audio/voice-over.json";

export class VoiceServiceImpl implements VoiceService {
  public constructor(
    private readonly elevenLabsClient: ElevenLabsClient,
    private readonly voiceOverRepository: VoiceOverRepository,
    private readonly workspaceManager: WorkspaceManager,
  ) {}

  public async generate(request: GenerateVoiceOverRequest): Promise<VoiceOver> {
    validateRequest(request);

    const generationFingerprint = createFingerprint(request);
    const existing = await this.voiceOverRepository.getByVideoId(
      request.videoId,
    );
    if (
      existing?.generationFingerprint === generationFingerprint &&
      existing.status !== "invalid" &&
      existing.durationMs !== null &&
      existing.durationMs > 0 &&
      (await fileExists(
        this.workspaceManager.resolvePath(request.videoId, existing.audioPath),
      ))
    ) {
      return existing;
    }

    const synthesisRequest: ElevenLabsSynthesisRequest = {
      voiceId: request.voiceId,
      text: request.script,
      languageCode: request.language,
    };
    if (request.model) {
      synthesisRequest.modelId = request.model;
    }
    if (request.outputFormat) {
      synthesisRequest.outputFormat = request.outputFormat;
    }
    if (request.voiceSettings) {
      synthesisRequest.voiceSettings = request.voiceSettings;
    }
    const result = await this.elevenLabsClient.synthesize(synthesisRequest);
    const audioPath = this.workspaceManager.resolvePath(
      request.videoId,
      VOICE_AUDIO_PATH,
    );
    await mkdir(this.workspaceManager.resolvePath(request.videoId, "audio"), {
      recursive: true,
    });
    await writeFile(audioPath, result.audio);

    const now = new Date();
    let segments: VoiceOver["segments"] = [];
    if (!result.alignment && result.durationMs && this.elevenLabsClient.transcribe) {
      const transcription = await this.elevenLabsClient.transcribe(
        result.audio,
        request.language,
      );
      segments = transcription.words.map((word, index) => ({
        id: `${existing?.id ?? request.videoId}-word-${index + 1}`,
        text: word.text,
        startMs: word.startMs,
        endMs: word.endMs,
        durationMs: word.endMs - word.startMs,
        sceneId: null,
      }));
    }

    const voiceOver: VoiceOver = {
      id: existing?.id ?? randomUUID(),
      videoId: request.videoId,
      provider: "elevenlabs",
      model: request.model ?? "eleven_multilingual_v2",
      voiceId: request.voiceId,
      language: request.language,
      script: request.script,
      audioPath: VOICE_AUDIO_PATH,
      durationMs: result.durationMs,
      alignment: result.alignment,
      segments,
      generationFingerprint,
      status: "generated",
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };

    await writeFile(
      this.workspaceManager.resolvePath(request.videoId, VOICE_METADATA_PATH),
      JSON.stringify(voiceOver, null, 2),
      "utf8",
    );

    if (existing) {
      return this.voiceOverRepository.update(voiceOver);
    }
    return this.voiceOverRepository.create(voiceOver);
  }
}

function validateRequest(request: GenerateVoiceOverRequest): void {
  if (request.videoId.trim().length === 0) {
    throw new Error("Video ID must not be empty");
  }
  if (request.script.trim().length === 0) {
    throw new Error("Voice script must not be empty");
  }
  if (request.voiceId.trim().length === 0) {
    throw new Error("Voice ID must not be empty");
  }
  if (request.language.trim().length === 0) {
    throw new Error("Voice language must not be empty");
  }
}

function createFingerprint(request: GenerateVoiceOverRequest): string {
  return createHash("sha256")
    .update(
      JSON.stringify({
        script: request.script,
        voiceId: request.voiceId,
        language: request.language,
        model: request.model ?? "eleven_multilingual_v2",
        outputFormat: request.outputFormat ?? "mp3_44100_128",
        voiceSettings: request.voiceSettings ?? null,
      }),
    )
    .digest("hex");
}

async function fileExists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch (error) {
    if (isFileNotFoundError(error)) {
      return false;
    }
    throw error;
  }
}

function isFileNotFoundError(error: unknown): error is NodeJS.ErrnoException {
  return (
    error instanceof Error &&
    "code" in error &&
    (error as NodeJS.ErrnoException).code === "ENOENT"
  );
}
