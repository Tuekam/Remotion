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

export class RegisterAssetTool {
  public constructor(
    private readonly registerAssetUseCase: RegisterAssetUseCase,
  ) {}

  public register(server: McpServer): void {
    server.registerTool(
      "register_asset",
      {
        description:
          "Register an asset. Use contentBase64 for files supplied by an external agent; /mnt/data paths are not visible to the Windows MCP process. Use sourcePath only for files already accessible on Windows.",
        inputSchema: z.object({
          videoId: z.string().min(1),
          sourcePath: z.string().min(1).optional(),
          contentBase64: z.string().min(1).optional(),
          name: z.string().min(1),
          type: z.enum(assetTypes),
          key: z.enum(assetKeys).nullable().optional(),
        }),
      },
      async ({ key, ...input }) => {
        if (!input.sourcePath && !input.contentBase64) {
          throw new Error("Provide sourcePath or contentBase64");
        }
        if (
          input.sourcePath &&
          (/^\/mnt\/data(?:\/|$)/i.test(input.sourcePath) ||
            /^C:\\mnt\\data(?:\\|$)/i.test(input.sourcePath))
        ) {
          throw new Error(
            "The MCP server cannot access /mnt/data. Send the file bytes with contentBase64 and keep the original extension in name.",
          );
        }
        return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              await this.registerAssetUseCase.execute({
                videoId: input.videoId,
                name: input.name,
                type: input.type,
                ...(input.sourcePath ? { sourcePath: input.sourcePath } : {}),
                ...(input.contentBase64
                  ? { contentBase64: input.contentBase64 }
                  : {}),
                key: key ?? null,
              }),
            ),
          },
        ],
        };
      },
    );
  }
}
