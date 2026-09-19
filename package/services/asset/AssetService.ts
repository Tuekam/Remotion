import { copyFile, mkdir, stat, writeFile } from "node:fs/promises";
import { basename } from "node:path";
import { randomUUID } from "node:crypto";
import type { Asset } from "../../../core/models/Asset.js";
import type { AssetManifest } from "../../../core/models/AssetManifest.js";
import type { AssetKey } from "../../../core/models/VideoType.js";
import type { WorkspaceManager } from "../contracts/WorkspaceManager.js";

export class AssetService {
  public constructor(private readonly workspaceManager: WorkspaceManager) {}

  /** Copies a server-accessible file into the current video's isolated workspace. */
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

  /** Decodes Base64 content and stores it with the exact provided filename. */
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

  /** Downloads a bounded HTTP(S) asset and stores the response metadata. */
  public async registerUrl(
    videoId: string,
    sourceUrl: string,
    type: Asset["type"],
    name: string,
    key: AssetKey | null,
    manifest: AssetManifest,
  ): Promise<{ asset: Asset; manifest: AssetManifest }> {
    const url = new URL(sourceUrl);
    if (url.protocol !== "https:" && url.protocol !== "http:") {
      throw new Error("Asset URL must use HTTP or HTTPS");
    }
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Asset download failed with status ${response.status}`);
    }
    const contentLength = Number(response.headers.get("content-length") ?? 0);
    if (contentLength > 50 * 1024 * 1024) {
      throw new Error("Asset download exceeds the 50 MB limit");
    }
    const content = new Uint8Array(await response.arrayBuffer());
    if (content.length === 0) {
      throw new Error("Asset download is empty");
    }
    if (content.length > 50 * 1024 * 1024) {
      throw new Error("Asset download exceeds the 50 MB limit");
    }
    return this.registerFile(
      videoId,
      type,
      name,
      key,
      manifest,
      async (targetPath) => writeFile(targetPath, content),
      response.headers.get("content-type") ?? "application/octet-stream",
    );
  }

  private async registerFile(
    videoId: string,
    type: Asset["type"],
    name: string,
    key: AssetKey | null,
    manifest: AssetManifest,
    writeAsset: (targetPath: string) => Promise<void>,
    mimeType = "application/octet-stream",
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
      mimeType,
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
