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
import { ListVideoTypesTool } from "./tools/ListVideoTypesTool.js";
import { GetVideoRequirementsTool } from "./tools/GetVideoRequirementsTool.js";
import { CreateVideoProjectTool } from "./tools/CreateVideoProjectTool.js";
import { RegisterAssetTool } from "./tools/RegisterAssetTool.js";
import { UpdateVideoBriefTool } from "./tools/UpdateVideoBriefTool.js";
import { ValidateVideoProjectTool } from "./tools/ValidateVideoProjectTool.js";
import { CreateVideoPlanTool } from "./tools/CreateVideoPlanTool.js";
import { ConfirmVideoProjectTool } from "./tools/ConfirmVideoProjectTool.js";
import { GetVideoPlanTool } from "./tools/GetVideoPlanTool.js";
import { GenerateVideoProjectTool } from "./tools/GenerateVideoProjectTool.js";
import { GenerateVoiceOverTool } from "./tools/GenerateVoiceOverTool.js";
import { GetVoiceOverTool } from "./tools/GetVoiceOverTool.js";
import { CreateProductionPlanTool } from "./tools/CreateProductionPlanTool.js";

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
    private readonly listVideoTypesTool: ListVideoTypesTool,
    private readonly getVideoRequirementsTool: GetVideoRequirementsTool,
    private readonly createVideoProjectTool: CreateVideoProjectTool,
    private readonly registerAssetTool: RegisterAssetTool,
    private readonly updateVideoBriefTool: UpdateVideoBriefTool,
    private readonly validateVideoProjectTool: ValidateVideoProjectTool,
    private readonly createVideoPlanTool: CreateVideoPlanTool,
    private readonly confirmVideoProjectTool: ConfirmVideoProjectTool,
    private readonly getVideoPlanTool: GetVideoPlanTool,
    private readonly generateVideoProjectTool: GenerateVideoProjectTool,
    private readonly generateVoiceOverTool: GenerateVoiceOverTool,
    private readonly getVoiceOverTool: GetVoiceOverTool,
    private readonly createProductionPlanTool: CreateProductionPlanTool,
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
      listVideoTypesTool,
      getVideoRequirementsTool,
      createVideoProjectTool,
      registerAssetTool,
      updateVideoBriefTool,
      validateVideoProjectTool,
      createVideoPlanTool,
      confirmVideoProjectTool,
      getVideoPlanTool,
      generateVideoProjectTool,
      generateVoiceOverTool,
      getVoiceOverTool,
      createProductionPlanTool,
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
