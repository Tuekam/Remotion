import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import type { AssetManifest } from "../../../core/models/AssetManifest.js";
import type { AudioTimeline } from "../../../core/models/AudioTimeline.js";
import type { ProductionPlan } from "../../../core/models/ProductionPlan.js";
import type { VideoBrief } from "../../../core/models/VideoBrief.js";
import type { VideoPlan } from "../../../core/models/VideoPlan.js";
import type { VoiceOver } from "../../../core/models/VoiceOver.js";

type StoredVideoBrief = Omit<VideoBrief, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};

type StoredAssetManifest = Omit<AssetManifest, "updatedAt" | "assets"> & {
  updatedAt: string;
  assets: Array<
    Omit<AssetManifest["assets"][number], "createdAt" | "updatedAt"> & {
      createdAt: string;
      updatedAt: string;
    }
  >;
};

type StoredVideoPlan = Omit<VideoPlan, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};

type StoredVoiceOver = Omit<VoiceOver, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};

type StoredAudioTimeline = Omit<AudioTimeline, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};

type StoredProductionPlan = Omit<ProductionPlan, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};

export class LocalVideoProjectStore {
  public constructor(
    private readonly briefStorePath: string,
    private readonly manifestStorePath: string,
    private readonly planStorePath: string,
    private readonly voiceOverStorePath: string,
    private readonly audioTimelineStorePath: string,
    private readonly productionPlanStorePath: string,
  ) {}

  public async createBrief(brief: VideoBrief): Promise<VideoBrief> {
    const briefs = await this.read<StoredVideoBrief>(this.briefStorePath);
    if (briefs.some((item) => item.id === brief.id)) {
      throw new Error(`Video brief already exists: ${brief.id}`);
    }
    await this.write(this.briefStorePath, [...briefs, serializeBrief(brief)]);
    return brief;
  }

  public async getBrief(videoId: string): Promise<VideoBrief | null> {
    const briefs = await this.read<StoredVideoBrief>(this.briefStorePath);
    const brief = briefs.find((item) => item.id === videoId);
    return brief ? hydrateBrief(brief) : null;
  }

  public async updateBrief(brief: VideoBrief): Promise<VideoBrief> {
    const briefs = await this.read<StoredVideoBrief>(this.briefStorePath);
    const index = briefs.findIndex((item) => item.id === brief.id);
    if (index === -1) {
      throw new Error(`Video brief not found: ${brief.id}`);
    }
    briefs[index] = serializeBrief(brief);
    await this.write(this.briefStorePath, briefs);
    return brief;
  }

  public async createManifest(manifest: AssetManifest): Promise<AssetManifest> {
    const manifests = await this.read<StoredAssetManifest>(this.manifestStorePath);
    if (manifests.some((item) => item.videoId === manifest.videoId)) {
      throw new Error(`Asset manifest already exists: ${manifest.videoId}`);
    }
    await this.write(this.manifestStorePath, [
      ...manifests,
      serializeManifest(manifest),
    ]);
    return manifest;
  }

  public async getManifest(videoId: string): Promise<AssetManifest | null> {
    const manifests = await this.read<StoredAssetManifest>(this.manifestStorePath);
    const manifest = manifests.find((item) => item.videoId === videoId);
    return manifest ? hydrateManifest(manifest) : null;
  }

  public async updateManifest(
    manifest: AssetManifest,
  ): Promise<AssetManifest> {
    const manifests = await this.read<StoredAssetManifest>(this.manifestStorePath);
    const index = manifests.findIndex(
      (item) => item.videoId === manifest.videoId,
    );
    if (index === -1) {
      throw new Error(`Asset manifest not found: ${manifest.videoId}`);
    }
    manifests[index] = serializeManifest(manifest);
    await this.write(this.manifestStorePath, manifests);
    return manifest;
  }

  public async createPlan(plan: VideoPlan): Promise<VideoPlan> {
    const plans = await this.read<StoredVideoPlan>(this.planStorePath);
    if (plans.some((item) => item.videoId === plan.videoId)) {
      throw new Error(`Video plan already exists: ${plan.videoId}`);
    }
    await this.write(this.planStorePath, [...plans, serializePlan(plan)]);
    return plan;
  }

  public async getPlan(videoId: string): Promise<VideoPlan | null> {
    const plans = await this.read<StoredVideoPlan>(this.planStorePath);
    const plan = plans.find((item) => item.videoId === videoId);
    return plan ? hydratePlan(plan) : null;
  }

  public async updatePlan(plan: VideoPlan): Promise<VideoPlan> {
    const plans = await this.read<StoredVideoPlan>(this.planStorePath);
    const index = plans.findIndex((item) => item.videoId === plan.videoId);
    if (index === -1) {
      throw new Error(`Video plan not found: ${plan.videoId}`);
    }
    plans[index] = serializePlan(plan);
    await this.write(this.planStorePath, plans);
    return plan;
  }

  public async createVoiceOver(voiceOver: VoiceOver): Promise<VoiceOver> {
    const voiceOvers = await this.read<StoredVoiceOver>(this.voiceOverStorePath);
    if (voiceOvers.some((item) => item.videoId === voiceOver.videoId)) {
      throw new Error(`Voice-over already exists: ${voiceOver.videoId}`);
    }
    await this.write(this.voiceOverStorePath, [
      ...voiceOvers,
      serializeVoiceOver(voiceOver),
    ]);
    return voiceOver;
  }

  public async getVoiceOver(videoId: string): Promise<VoiceOver | null> {
    const voiceOvers = await this.read<StoredVoiceOver>(this.voiceOverStorePath);
    const voiceOver = voiceOvers.find((item) => item.videoId === videoId);
    return voiceOver ? hydrateVoiceOver(voiceOver) : null;
  }

  public async updateVoiceOver(voiceOver: VoiceOver): Promise<VoiceOver> {
    const voiceOvers = await this.read<StoredVoiceOver>(this.voiceOverStorePath);
    const index = voiceOvers.findIndex(
      (item) => item.videoId === voiceOver.videoId,
    );
    if (index === -1) {
      throw new Error(`Voice-over not found: ${voiceOver.videoId}`);
    }
    voiceOvers[index] = serializeVoiceOver(voiceOver);
    await this.write(this.voiceOverStorePath, voiceOvers);
    return voiceOver;
  }

  public async createAudioTimeline(
    timeline: AudioTimeline,
  ): Promise<AudioTimeline> {
    const timelines = await this.read<StoredAudioTimeline>(
      this.audioTimelineStorePath,
    );
    if (timelines.some((item) => item.videoId === timeline.videoId)) {
      throw new Error(`Audio timeline already exists: ${timeline.videoId}`);
    }
    await this.write(this.audioTimelineStorePath, [
      ...timelines,
      serializeAudioTimeline(timeline),
    ]);
    return timeline;
  }

  public async getAudioTimeline(videoId: string): Promise<AudioTimeline | null> {
    const timelines = await this.read<StoredAudioTimeline>(
      this.audioTimelineStorePath,
    );
    const timeline = timelines.find((item) => item.videoId === videoId);
    return timeline ? hydrateAudioTimeline(timeline) : null;
  }

  public async updateAudioTimeline(
    timeline: AudioTimeline,
  ): Promise<AudioTimeline> {
    const timelines = await this.read<StoredAudioTimeline>(
      this.audioTimelineStorePath,
    );
    const index = timelines.findIndex(
      (item) => item.videoId === timeline.videoId,
    );
    if (index === -1) {
      throw new Error(`Audio timeline not found: ${timeline.videoId}`);
    }
    timelines[index] = serializeAudioTimeline(timeline);
    await this.write(this.audioTimelineStorePath, timelines);
    return timeline;
  }

  public async createProductionPlan(
    plan: ProductionPlan,
  ): Promise<ProductionPlan> {
    const plans = await this.read<StoredProductionPlan>(
      this.productionPlanStorePath,
    );
    if (plans.some((item) => item.videoId === plan.videoId)) {
      throw new Error(`Production plan already exists: ${plan.videoId}`);
    }
    await this.write(this.productionPlanStorePath, [
      ...plans,
      serializeProductionPlan(plan),
    ]);
    return plan;
  }

  public async getProductionPlan(
    videoId: string,
  ): Promise<ProductionPlan | null> {
    const plans = await this.read<StoredProductionPlan>(
      this.productionPlanStorePath,
    );
    const plan = plans.find((item) => item.videoId === videoId);
    return plan ? hydrateProductionPlan(plan) : null;
  }

  public async updateProductionPlan(
    plan: ProductionPlan,
  ): Promise<ProductionPlan> {
    const plans = await this.read<StoredProductionPlan>(
      this.productionPlanStorePath,
    );
    const index = plans.findIndex((item) => item.videoId === plan.videoId);
    if (index === -1) {
      throw new Error(`Production plan not found: ${plan.videoId}`);
    }
    plans[index] = serializeProductionPlan(plan);
    await this.write(this.productionPlanStorePath, plans);
    return plan;
  }

  private async read<T>(path: string): Promise<T[]> {
    try {
      const content = await readFile(path, "utf8");
      const values = JSON.parse(content) as T[];
      return values;
    } catch (error) {
      if (isFileNotFoundError(error)) {
        return [];
      }
      throw error;
    }
  }

  private async write<T>(path: string, values: T[]): Promise<void> {
    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, JSON.stringify(values, null, 2), "utf8");
  }
}

function hydrateBrief(brief: StoredVideoBrief): VideoBrief {
  return {
    ...brief,
    createdAt: new Date(brief.createdAt),
    updatedAt: new Date(brief.updatedAt),
  };
}

function serializeBrief(brief: VideoBrief): StoredVideoBrief {
  return {
    ...brief,
    createdAt: brief.createdAt.toISOString(),
    updatedAt: brief.updatedAt.toISOString(),
  };
}

function hydrateManifest(manifest: StoredAssetManifest): AssetManifest {
  return {
    ...manifest,
    updatedAt: new Date(manifest.updatedAt),
    assets: manifest.assets.map((asset) => ({
      ...asset,
      createdAt: new Date(asset.createdAt),
      updatedAt: new Date(asset.updatedAt),
    })),
  };
}

function serializeManifest(manifest: AssetManifest): StoredAssetManifest {
  return {
    ...manifest,
    updatedAt: manifest.updatedAt.toISOString(),
    assets: manifest.assets.map((asset) => ({
      ...asset,
      createdAt: asset.createdAt.toISOString(),
      updatedAt: asset.updatedAt.toISOString(),
    })),
  };
}

function hydratePlan(plan: StoredVideoPlan): VideoPlan {
  return {
    ...plan,
    createdAt: new Date(plan.createdAt),
    updatedAt: new Date(plan.updatedAt),
  };
}

function serializePlan(plan: VideoPlan): StoredVideoPlan {
  return {
    ...plan,
    createdAt: plan.createdAt.toISOString(),
    updatedAt: plan.updatedAt.toISOString(),
  };
}

function hydrateVoiceOver(voiceOver: StoredVoiceOver): VoiceOver {
  return {
    ...voiceOver,
    createdAt: new Date(voiceOver.createdAt),
    updatedAt: new Date(voiceOver.updatedAt),
  };
}

function serializeVoiceOver(voiceOver: VoiceOver): StoredVoiceOver {
  return {
    ...voiceOver,
    createdAt: voiceOver.createdAt.toISOString(),
    updatedAt: voiceOver.updatedAt.toISOString(),
  };
}

function hydrateAudioTimeline(timeline: StoredAudioTimeline): AudioTimeline {
  return {
    ...timeline,
    createdAt: new Date(timeline.createdAt),
    updatedAt: new Date(timeline.updatedAt),
    voiceOver: hydrateVoiceOver({
      ...timeline.voiceOver,
      createdAt: timeline.voiceOver.createdAt.toISOString(),
      updatedAt: timeline.voiceOver.updatedAt.toISOString(),
    }),
  };
}

function serializeAudioTimeline(
  timeline: AudioTimeline,
): StoredAudioTimeline {
  return {
    ...timeline,
    createdAt: timeline.createdAt.toISOString(),
    updatedAt: timeline.updatedAt.toISOString(),
    voiceOver: {
      ...timeline.voiceOver,
      createdAt: timeline.voiceOver.createdAt,
      updatedAt: timeline.voiceOver.updatedAt,
    },
  };
}

function hydrateProductionPlan(plan: StoredProductionPlan): ProductionPlan {
  return {
    ...plan,
    createdAt: new Date(plan.createdAt),
    updatedAt: new Date(plan.updatedAt),
    audioTimeline: hydrateAudioTimeline({
      ...plan.audioTimeline,
      createdAt: plan.audioTimeline.createdAt.toISOString(),
      updatedAt: plan.audioTimeline.updatedAt.toISOString(),
    }),
  };
}

function serializeProductionPlan(
  plan: ProductionPlan,
): StoredProductionPlan {
  return {
    ...plan,
    createdAt: plan.createdAt.toISOString(),
    updatedAt: plan.updatedAt.toISOString(),
    audioTimeline: {
      ...plan.audioTimeline,
      createdAt: plan.audioTimeline.createdAt,
      updatedAt: plan.audioTimeline.updatedAt,
    },
  };
}

function isFileNotFoundError(error: unknown): error is NodeJS.ErrnoException {
  return (
    error instanceof Error &&
    "code" in error &&
    (error as NodeJS.ErrnoException).code === "ENOENT"
  );
}
