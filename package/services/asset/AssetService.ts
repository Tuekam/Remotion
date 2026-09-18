import { copyFile, mkdir, stat, writeFile } from "node:fs/promises";
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
    return this.registerFile(
      videoId,
      type,
      name,
      key,
      manifest,
      async (targetPath) => copyFile(sourcePath, targetPath),
    );
  }

  public async registerContent(
    videoId: string,
    contentBase64: string,
    type: Asset["type"],
    name: string,
    key: AssetKey | null,
    manifest: AssetManifest,
  ): Promise<{ asset: Asset; manifest: AssetManifest }> {
    const content = decodeBase64(contentBase64);
    return this.registerFile(
      videoId,
      type,
      name,
      key,
      manifest,
      async (targetPath) => writeFile(targetPath, content),
    );
  }

  private async registerFile(
    videoId: string,
    type: Asset["type"],
    name: string,
    key: AssetKey | null,
    manifest: AssetManifest,
    writeAsset: (targetPath: string) => Promise<void>,
  ): Promise<{ asset: Asset; manifest: AssetManifest }> {
    const fileName = basename(name);
    if (
      fileName.length === 0 ||
      fileName !== name ||
      !/\.[A-Za-z0-9]+$/.test(fileName)
    ) {
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
    await writeAsset(targetPath);
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

function decodeBase64(contentBase64: string): Buffer {
  const value = contentBase64.replace(/^data:[^;]+;base64,/, "");
  if (value.length === 0 || !/^[A-Za-z0-9+/]*={0,2}$/.test(value)) {
    throw new Error("Asset content must be valid Base64");
  }
  return Buffer.from(value, "base64");
}
