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
        description: "Copy and register a user asset in the current video project.",
        inputSchema: z.object({
          videoId: z.string().min(1),
          sourcePath: z.string().min(1),
          name: z.string().min(1),
          type: z.enum(assetTypes),
          key: z.enum(assetKeys).nullable().optional(),
        }),
      },
      async ({ key, ...input }) => ({
        content: [
          {
            type: "text",
            text: JSON.stringify(
              await this.registerAssetUseCase.execute({
                ...input,
                key: key ?? null,
              }),
            ),
          },
        ],
      }),
    );
  }
}
