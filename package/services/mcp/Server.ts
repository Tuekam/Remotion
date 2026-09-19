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
import { CreateVideoProjectTool } from "./tools/CreateVideoProjectTool.js";
import { RegisterAssetTool } from "./tools/RegisterAssetTool.js";
import { UpdateVideoBriefTool } from "./tools/UpdateVideoBriefTool.js";
import { ValidateVideoProjectTool } from "./tools/ValidateVideoProjectTool.js";
import { ConfirmVideoProjectTool } from "./tools/ConfirmVideoProjectTool.js";
import { GenerateVideoProjectTool } from "./tools/GenerateVideoProjectTool.js";
import { GenerateVoiceOverTool } from "./tools/GenerateVoiceOverTool.js";
import { GetVoiceOverTool } from "./tools/GetVoiceOverTool.js";
import { CreateProductionPlanTool } from "./tools/CreateProductionPlanTool.js";
import { UploadAssetChunkTool } from "./tools/UploadAssetChunkTool.js";
import type { McpTool } from "./contracts/McpTool.js";

/** Orchestre les opérations du composant McpVideoServer dans le flux applicatif. */
export class McpVideoServer {
/** Initialise l’instance avec les dépendances injectées nécessaires à son rôle. */
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
    private readonly createVideoProjectTool: CreateVideoProjectTool,
    private readonly registerAssetTool: RegisterAssetTool,
    private readonly updateVideoBriefTool: UpdateVideoBriefTool,
    private readonly validateVideoProjectTool: ValidateVideoProjectTool,
    private readonly confirmVideoProjectTool: ConfirmVideoProjectTool,
    private readonly generateVideoProjectTool: GenerateVideoProjectTool,
    private readonly generateVoiceOverTool: GenerateVoiceOverTool,
    private readonly getVoiceOverTool: GetVoiceOverTool,
    private readonly createProductionPlanTool: CreateProductionPlanTool,
    private readonly uploadAssetChunkTool: UploadAssetChunkTool,
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
      createVideoProjectTool,
      registerAssetTool,
      updateVideoBriefTool,
      validateVideoProjectTool,
      confirmVideoProjectTool,
      generateVideoProjectTool,
      generateVoiceOverTool,
      getVoiceOverTool,
      createProductionPlanTool,
      uploadAssetChunkTool,
    ]);
  }

/** Réalise l’opération start sur les données reçues et retourne le résultat attendu. */
  public async start(): Promise<void> {
    await this.mcpServer.connect(this.transport);
  }

  private registerTools(tools: McpTool[]): void {
    for (const tool of tools) {
      tool.register(this.mcpServer);
    }
  }
}
