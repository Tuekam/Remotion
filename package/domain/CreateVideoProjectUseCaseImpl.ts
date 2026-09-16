import { randomUUID } from "node:crypto";
import type { AssetManifest } from "../../core/models/AssetManifest.js";
import type { VideoBrief } from "../../core/models/VideoBrief.js";
import type { AssetManifestRepository } from "../../core/repository/AssetManifestRepository.js";
import type { VideoBriefRepository } from "../../core/repository/VideoBriefRepository.js";
import type {
  CreateVideoProjectInput,
  CreateVideoProjectUseCase,
} from "../../core/use-case/CreateVideoProjectUseCase.js";
import type { WorkspaceManager } from "../services/video-engine/contracts/WorkspaceManager.js";

export class CreateVideoProjectUseCaseImpl
  implements CreateVideoProjectUseCase
{
  public constructor(
    private readonly workspaceManager: WorkspaceManager,
    private readonly videoBriefRepository: VideoBriefRepository,
    private readonly assetManifestRepository: AssetManifestRepository,
  ) {}

  public async execute(input: CreateVideoProjectInput): Promise<VideoBrief> {
    if (input.videoId.trim().length === 0) {
      throw new Error("Video id is required");
    }

    await this.workspaceManager.create(input.videoId);
    const now = new Date();
    const brief: VideoBrief = {
      id: input.videoId,
      type: null,
      objective: null,
      platform: null,
      format: null,
      durationInSeconds: null,
      language: null,
      product: null,
      name: null,
      description: null,
      features: [],
      service: null,
      company: null,
      activity: null,
      valueProposition: null,
      offer: null,
      price: null,
      callToAction: null,
      targetAudience: null,
      problem: null,
      solution: null,
      howItWorks: null,
      client: null,
      experience: null,
      initialProblem: null,
      result: null,
      eventDate: null,
      locationOrLink: null,
      benefits: [],
      brand: null,
      assetIds: [],
      status: "incomplete",
      typeConfirmed: false,
      createdAt: now,
      updatedAt: now,
    };
    const manifest: AssetManifest = {
      videoId: input.videoId,
      assets: [],
      updatedAt: now,
    };

    await this.videoBriefRepository.create(brief);
    await this.assetManifestRepository.create(manifest);
    return brief;
  }
}
