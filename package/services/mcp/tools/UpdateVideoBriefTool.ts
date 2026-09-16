import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/server";
import type { UpdateVideoBriefUseCase } from "../../../../core/use-case/UpdateVideoBriefUseCase.js";

const videoTypeIds = [
  "product-presentation",
  "product-promotion",
  "product-demo",
  "service-presentation",
  "problem-solution",
  "company-presentation",
  "testimonial",
  "event-promotion",
] as const;

export class UpdateVideoBriefTool {
  public constructor(
    private readonly updateVideoBriefUseCase: UpdateVideoBriefUseCase,
  ) {}

  public register(server: McpServer): void {
    server.registerTool(
      "update_video_brief",
      {
        description: "Update the structured brief of a video project.",
        inputSchema: z.object({
          videoId: z.string().min(1),
          type: z.enum(videoTypeIds).nullable().optional(),
          objective: z.string().nullable().optional(),
          platform: z.string().nullable().optional(),
          format: z.string().nullable().optional(),
          durationInSeconds: z.number().positive().nullable().optional(),
          language: z.string().nullable().optional(),
          product: z.string().nullable().optional(),
          name: z.string().nullable().optional(),
          description: z.string().nullable().optional(),
          features: z.array(z.string()).optional(),
          service: z.string().nullable().optional(),
          company: z.string().nullable().optional(),
          activity: z.string().nullable().optional(),
          valueProposition: z.string().nullable().optional(),
          offer: z.string().nullable().optional(),
          price: z.string().nullable().optional(),
          callToAction: z.string().nullable().optional(),
          targetAudience: z.string().nullable().optional(),
          problem: z.string().nullable().optional(),
          solution: z.string().nullable().optional(),
          howItWorks: z.string().nullable().optional(),
          benefits: z.array(z.string()).optional(),
          brand: z.string().nullable().optional(),
          client: z.string().nullable().optional(),
          experience: z.string().nullable().optional(),
          initialProblem: z.string().nullable().optional(),
          result: z.string().nullable().optional(),
          eventDate: z.string().nullable().optional(),
          locationOrLink: z.string().nullable().optional(),
        }),
      },
      async ({ videoId, type, ...input }) => ({
        content: [
          {
            type: "text",
            text: JSON.stringify(
              await this.updateVideoBriefUseCase.execute(videoId, {
                ...input,
                ...(type !== undefined ? { type } : {}),
              }),
            ),
          },
        ],
      }),
    );
  }
}
