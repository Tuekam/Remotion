import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import type { AssetManifest } from "../../../core/models/AssetManifest.js";
import type { AudioTimeline } from "../../../core/models/AudioTimeline.js";
import type { ProductionPlan } from "../../../core/models/ProductionPlan.js";
import type { VideoBrief } from "../../../core/models/VideoBrief.js";
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

/** Orchestre les opérations du composant LocalVideoProjectStore dans le flux applicatif. */
export class LocalVideoProjectStore {
/** Initialise l’instance avec les dépendances injectées nécessaires à son rôle. */
  public constructor(
    private readonly briefStorePath: string,
    private readonly manifestStorePath: string,
    private readonly voiceOverStorePath: string,
    private readonly audioTimelineStorePath: string,
    private readonly productionPlanStorePath: string,
  ) {}

  /** Persiste un nouveau VideoBrief dans le fichier JSON dédié; refuse les doublons et retourne le brief fourni. */
  public async createBrief(brief: VideoBrief): Promise<VideoBrief> {
    const briefs = await this.read<StoredVideoBrief>(this.briefStorePath);
    if (briefs.some((item) => item.id === brief.id)) {
      throw new Error(`Video brief already exists: ${brief.id}`);
    }
    await this.write(this.briefStorePath, [...briefs, serializeBrief(brief)]);
    return brief;
  }

  /** Charge le VideoBrief associé à un identifiant vidéo et restaure ses dates; retourne null si absent. */
  public async getBrief(videoId: string): Promise<VideoBrief | null> {
    const briefs = await this.read<StoredVideoBrief>(this.briefStorePath);
    const brief = briefs.find((item) => item.id === videoId);
    return brief ? hydrateBrief(brief) : null;
  }

  /** Remplace le VideoBrief existant dans le stockage JSON après vérification de son existence. */
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

  /** Persiste le manifeste d’assets d’une vidéo et interdit plusieurs manifestes pour le même videoId. */
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

  /** Charge le manifeste d’assets d’une vidéo et reconstruit les dates de chaque asset. */
  public async getManifest(videoId: string): Promise<AssetManifest | null> {
    const manifests = await this.read<StoredAssetManifest>(this.manifestStorePath);
    const manifest = manifests.find((item) => item.videoId === videoId);
    return manifest ? hydrateManifest(manifest) : null;
  }

  /** Met à jour le manifeste d’assets existant en le sérialisant dans le fichier JSON. */
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

  /** Persiste la voix off d’une vidéo et garantit son unicité par videoId. */
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

  /** Charge la voix off associée à une vidéo et restaure ses dates de création et de mise à jour. */
  public async getVoiceOver(videoId: string): Promise<VoiceOver | null> {
    const voiceOvers = await this.read<StoredVoiceOver>(this.voiceOverStorePath);
    const voiceOver = voiceOvers.find((item) => item.videoId === videoId);
    return voiceOver ? hydrateVoiceOver(voiceOver) : null;
  }

  /** Met à jour la voix off persistée d’une vidéo après vérification de son existence. */
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

  /** Persiste la timeline audio d’une vidéo et refuse les doublons de videoId. */
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

  /** Charge la timeline audio d’une vidéo en reconvertissant les dates JSON en objets Date. */
  public async getAudioTimeline(videoId: string): Promise<AudioTimeline | null> {
    const timelines = await this.read<StoredAudioTimeline>(
      this.audioTimelineStorePath,
    );
    const timeline = timelines.find((item) => item.videoId === videoId);
    return timeline ? hydrateAudioTimeline(timeline) : null;
  }

  /** Remplace la timeline audio existante dans le fichier JSON de la vidéo. */
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

  /** Persiste le plan de production audio d’une vidéo et en garantit l’unicité. */
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

  /** Charge le plan de production d’une vidéo et restaure ses dates persistées. */
  public async getProductionPlan(
    videoId: string,
  ): Promise<ProductionPlan | null> {
    const plans = await this.read<StoredProductionPlan>(
      this.productionPlanStorePath,
    );
    const plan = plans.find((item) => item.videoId === videoId);
    return plan ? hydrateProductionPlan(plan) : null;
  }

  /** Met à jour le plan de production existant dans le stockage JSON. */
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

/** Convertit les données JSON persistées en VideoBrief en restaurant les instances Date. */
function hydrateBrief(brief: StoredVideoBrief): VideoBrief {
  return {
    ...brief,
    createdAt: new Date(brief.createdAt),
    updatedAt: new Date(brief.updatedAt),
  };
}

/** Convertit un VideoBrief métier en représentation JSON avec des dates ISO. */
function serializeBrief(brief: VideoBrief): StoredVideoBrief {
  return {
    ...brief,
    createdAt: brief.createdAt.toISOString(),
    updatedAt: brief.updatedAt.toISOString(),
  };
}

/** Reconstruit un AssetManifest métier et les dates de chaque asset à partir du JSON. */
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

/** Prépare un AssetManifest pour la persistance en convertissant toutes les dates en chaînes ISO. */
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

/** Reconstruit une VoiceOver métier depuis le JSON et restaure ses dates. */
function hydrateVoiceOver(voiceOver: StoredVoiceOver): VoiceOver {
  return {
    ...voiceOver,
    createdAt: new Date(voiceOver.createdAt),
    updatedAt: new Date(voiceOver.updatedAt),
  };
}

/** Prépare une VoiceOver pour la persistance en convertissant ses dates en ISO. */
function serializeVoiceOver(voiceOver: VoiceOver): StoredVoiceOver {
  return {
    ...voiceOver,
    createdAt: voiceOver.createdAt.toISOString(),
    updatedAt: voiceOver.updatedAt.toISOString(),
  };
}

/** Reconstruit une AudioTimeline métier depuis le JSON et restaure ses dates. */
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

/** Prépare une AudioTimeline pour la persistance en convertissant ses dates en ISO. */
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

/** Reconstruit un ProductionPlan métier depuis le JSON et restaure ses dates. */
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

/** Prépare un ProductionPlan pour la persistance en convertissant ses dates en ISO. */
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

/** Identifie une erreur système signalant qu’un fichier ou répertoire n’existe pas. */
function isFileNotFoundError(error: unknown): error is NodeJS.ErrnoException {
  return (
    error instanceof Error &&
    "code" in error &&
    (error as NodeJS.ErrnoException).code === "ENOENT"
  );
}
