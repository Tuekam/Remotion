import { McpServer } from "@modelcontextprotocol/server";
import type { Transport } from "@modelcontextprotocol/server";
import { CreateDirectoryTool } from "./tools/CreateDirectoryTool.js";
import { DeleteFileTool } from "./tools/DeleteFileTool.js";
import { InspectAssetTool } from "./tools/InspectAssetTool.js";
import { InspectDirectoryTool } from "./tools/InspectDirectoryTool.js";
import { ReadFileTool } from "./tools/ReadFileTool.js";
import { UpdateFileTool } from "./tools/UpdateFileTool.js";
import { WriteFileTool } from "./tools/WriteFileTool.js";
import { ExecuteCodeTool } from "./tools/ExecuteCodeTool.js";
import { GetRenderResultTool } from "./tools/GetRenderResultTool.js";
import { RenderVideoTool } from "./tools/RenderVideoTool.js";

interface McpTool {
  register(server: McpServer): void;
}

export class McpVideoServer {
  public constructor(
    private readonly mcpServer: McpServer,
    private readonly transport: Transport,
    private readonly inspectDirectoryTool: InspectDirectoryTool,
    private readonly createDirectoryTool: CreateDirectoryTool,
    private readonly readFileTool: ReadFileTool,
    private readonly writeFileTool: WriteFileTool,
    private readonly updateFileTool: UpdateFileTool,
    private readonly deleteFileTool: DeleteFileTool,
    private readonly inspectAssetTool: InspectAssetTool,
    private readonly executeCodeTool: ExecuteCodeTool,
    private readonly renderVideoTool: RenderVideoTool,
    private readonly getRenderResultTool: GetRenderResultTool,
  ) {
    this.registerTools([
      inspectDirectoryTool,
      createDirectoryTool,
      readFileTool,
      writeFileTool,
      updateFileTool,
      deleteFileTool,
      inspectAssetTool,
      executeCodeTool,
      renderVideoTool,
      getRenderResultTool,
    ]);
  }

  public async start(): Promise<void> {
    await this.mcpServer.connect(this.transport);
  }

  private registerTools(tools: McpTool[]): void {
    for (const tool of tools) {
      tool.register(this.mcpServer);
    }
  }
}
