import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/server";
import type { ListVideoTypesUseCase } from "../../../../core/use-case/ListVideoTypesUseCase.js";

export class ListVideoTypesTool {
  public constructor(
    private readonly listVideoTypesUseCase: ListVideoTypesUseCase,
  ) {}

  public register(server: McpServer): void {
    server.registerTool(
      "list_video_types",
      {
        description: "List the available advertising video types.",
        inputSchema: z.object({}),
      },
      async () => ({
        content: [
          {
            type: "text",
            text: JSON.stringify(await this.listVideoTypesUseCase.execute()),
          },
        ],
      }),
    );
  }
}
