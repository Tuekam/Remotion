import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import type { AssetManifest } from "../../../core/models/AssetManifest.js";
import type { VideoBrief } from "../../../core/models/VideoBrief.js";
import type { VideoPlan } from "../../../core/models/VideoPlan.js";

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

export class LocalVideoProjectStore {
  public constructor(
    private readonly briefStorePath: string,
    private readonly manifestStorePath: string,
    private readonly planStorePath: string,
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

function isFileNotFoundError(error: unknown): error is NodeJS.ErrnoException {
  return (
    error instanceof Error &&
    "code" in error &&
    (error as NodeJS.ErrnoException).code === "ENOENT"
  );
}
