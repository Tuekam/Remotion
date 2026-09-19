import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/server";
import type { RegisterAssetUseCase } from "../../../../core/use-case/RegisterAssetUseCase.js";

const assetTypes = ["image", "video", "audio", "document"] as const;
const assetKeys = [
  "productVisual",
  "productDemo",
  "logo",
  "promotionalVisual",
  "serviceVisual",
  "companyVisual",
  "testimonial",
  "clientPhoto",
  "proof",
  "eventPoster",
  "speakerVisual",
  "program",
] as const;

interface UploadState {
  videoId: string;
  name: string;
  type: (typeof assetTypes)[number];
  key: (typeof assetKeys)[number] | null;
  totalChunks: number;
  chunks: Map<number, string>;
}

/** Orchestre les opérations du composant UploadAssetChunkTool dans le flux applicatif. */
export class UploadAssetChunkTool {
  private readonly uploads = new Map<string, UploadState>();

/** Initialise l’instance avec les dépendances injectées nécessaires à son rôle. */
  public constructor(
    private readonly registerAssetUseCase: RegisterAssetUseCase,
  ) {}

/** Enregistre les outils du composant auprès du serveur MCP fourni. */
  public register(server: McpServer): void {
    server.registerTool(
      "upload_asset_chunk",
      {
        description:
          "Upload a large asset as Base64 chunks. Send chunks in order, then finalize=true on the last call. Preserve the complete filename extension.",
        inputSchema: z.object({
          uploadId: z.string().min(1),
          videoId: z.string().min(1),
          name: z.string().min(1),
          type: z.enum(assetTypes),
          key: z.enum(assetKeys).nullable().optional(),
          chunkIndex: z.number().int().min(0),
          totalChunks: z.number().int().positive(),
          contentBase64Chunk: z.string().min(1),
          finalize: z.boolean().optional(),
        }),
      },
      async (input) => {
        let state = this.uploads.get(input.uploadId);
        if (!state) {
          state = {
            videoId: input.videoId,
            name: input.name,
            type: input.type,
            key: input.key ?? null,
            totalChunks: input.totalChunks,
            chunks: new Map(),
          };
          this.uploads.set(input.uploadId, state);
        }

        if (
          state.videoId !== input.videoId ||
          state.name !== input.name ||
          state.totalChunks !== input.totalChunks
        ) {
          throw new Error("Upload metadata does not match the existing upload");
        }
        if (input.chunkIndex >= input.totalChunks) {
          throw new Error("Chunk index is outside the upload");
        }

        state.chunks.set(input.chunkIndex, input.contentBase64Chunk);
        const complete =
          input.finalize === true &&
          state.chunks.size === state.totalChunks &&
          [...state.chunks.keys()].every((index) => state.chunks.has(index));

        if (!complete) {
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify({
                  uploadId: input.uploadId,
                  receivedChunks: state.chunks.size,
                  totalChunks: state.totalChunks,
                  complete: false,
                }),
              },
            ],
          };
        }

        const contentBase64 = [...Array(state.totalChunks).keys()]
          .map((index) => state?.chunks.get(index) ?? "")
          .join("");
        this.uploads.delete(input.uploadId);
        const asset = await this.registerAssetUseCase.execute({
          videoId: state.videoId,
          name: state.name,
          type: state.type,
          key: state.key,
          contentBase64,
        });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(asset),
            },
          ],
        };
      },
    );
  }
}
