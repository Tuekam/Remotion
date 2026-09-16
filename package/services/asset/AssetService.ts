import { copyFile, mkdir, stat } from "node:fs/promises";
import { basename } from "node:path";
import { randomUUID } from "node:crypto";
import type { Asset } from "../../../core/models/Asset.js";
import type { AssetManifest } from "../../../core/models/AssetManifest.js";
import type { AssetKey } from "../../../core/models/VideoType.js";
import type { WorkspaceManager } from "../video-engine/contracts/WorkspaceManager.js";

export class AssetService {
  public constructor(private readonly workspaceManager: WorkspaceManager) {}

  public async register(
    videoId: string,
    sourcePath: string,
    type: Asset["type"],
    name: string,
    key: AssetKey | null,
    manifest: AssetManifest,
  ): Promise<{ asset: Asset; manifest: AssetManifest }> {
    const fileName = basename(name);
    if (fileName.length === 0 || fileName !== name) {
      throw new Error("Asset name must be a file name");
    }

    const targetRelativePath = `assets/${fileName}`;
    const targetPath = this.workspaceManager.resolvePath(
      videoId,
      targetRelativePath,
    );
    await mkdir(this.workspaceManager.resolvePath(videoId, "assets"), {
      recursive: true,
    });
    await copyFile(sourcePath, targetPath);
    const metadata = await stat(targetPath);
    const now = new Date();
    const asset: Asset = {
      id: randomUUID(),
      videoId,
      name: fileName,
      key,
      type,
      relativePath: targetRelativePath,
      mimeType: "application/octet-stream",
      sizeInBytes: metadata.size,
      dimensions: null,
      durationInSeconds: null,
      createdAt: now,
      updatedAt: now,
    };

    return {
      asset,
      manifest: {
        ...manifest,
        assets: [...manifest.assets, asset],
        updatedAt: now,
      },
    };
  }
}
