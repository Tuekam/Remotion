import { McpServer } from "@modelcontextprotocol/server";
import { StdioServerTransport } from "@modelcontextprotocol/server/stdio";
import {
  asClass,
  asFunction,
  asValue,
  createContainer,
  InjectionMode,
} from "awilix";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { GenerateVideoUseCaseImpl } from "./package/domain/GenerateVideoUseCaseImpl.js";
import { CreateVideoProjectUseCaseImpl } from "./package/domain/CreateVideoProjectUseCaseImpl.js";
import { ConfirmVideoProjectUseCaseImpl } from "./package/domain/ConfirmVideoProjectUseCaseImpl.js";
import { RegisterAssetUseCaseImpl } from "./package/domain/RegisterAssetUseCaseImpl.js";
import { UpdateVideoBriefUseCaseImpl } from "./package/domain/UpdateVideoBriefUseCaseImpl.js";
import { GenerateVideoProjectUseCaseImpl } from "./package/domain/GenerateVideoProjectUseCaseImpl.js";
import { ValidateVideoProjectUseCaseImpl } from "./package/domain/ValidateVideoProjectUseCaseImpl.js";
import { LocalVideoProjectStore } from "./package/data/database/LocalVideoProjectStore.js";
import { AssetManifestRepositoryImpl } from "./package/data/AssetManifestRepositoryImpl.js";
import { VideoBriefRepositoryImpl } from "./package/data/VideoBriefRepositoryImpl.js";
import { VoiceOverRepositoryImpl } from "./package/data/VoiceOverRepositoryImpl.js";
import { AudioTimelineRepositoryImpl } from "./package/data/AudioTimelineRepositoryImpl.js";
import { ProductionPlanRepositoryImpl } from "./package/data/ProductionPlanRepositoryImpl.js";
import { McpVideoServer } from "./package/services/mcp/Server.js";
import { WorkspaceFileService } from "./package/services/mcp/workspace/WorkspaceFileService.js";
import { CreateDirectoryTool } from "./package/services/mcp/tools/CreateDirectoryTool.js";
import { DeleteFileTool } from "./package/services/mcp/tools/DeleteFileTool.js";
import { InspectAssetTool } from "./package/services/mcp/tools/InspectAssetTool.js";
import { InspectDirectoryTool } from "./package/services/mcp/tools/InspectDirectoryTool.js";
import { ReadFileTool } from "./package/services/mcp/tools/ReadFileTool.js";
import { UpdateFileTool } from "./package/services/mcp/tools/UpdateFileTool.js";
import { WriteFileTool } from "./package/services/mcp/tools/WriteFileTool.js";
import { ExecuteCodeTool } from "./package/services/mcp/tools/ExecuteCodeTool.js";
import { GetRenderResultTool } from "./package/services/mcp/tools/GetRenderResultTool.js";
import { RenderVideoTool } from "./package/services/mcp/tools/RenderVideoTool.js";
import { CreateVideoProjectTool } from "./package/services/mcp/tools/CreateVideoProjectTool.js";
import { RegisterAssetTool } from "./package/services/mcp/tools/RegisterAssetTool.js";
import { UploadAssetChunkTool } from "./package/services/mcp/tools/UploadAssetChunkTool.js";
import { UpdateVideoBriefTool } from "./package/services/mcp/tools/UpdateVideoBriefTool.js";
import { ValidateVideoProjectTool } from "./package/services/mcp/tools/ValidateVideoProjectTool.js";
import { ConfirmVideoProjectTool } from "./package/services/mcp/tools/ConfirmVideoProjectTool.js";
import { GenerateVideoProjectTool } from "./package/services/mcp/tools/GenerateVideoProjectTool.js";
import { GenerateVoiceOverUseCaseImpl } from "./package/domain/GenerateVoiceOverUseCaseImpl.js";
import { GetVoiceOverUseCaseImpl } from "./package/domain/GetVoiceOverUseCaseImpl.js";
import { CreateProductionPlanUseCaseImpl } from "./package/domain/CreateProductionPlanUseCaseImpl.js";
import { GenerateVoiceOverTool } from "./package/services/mcp/tools/GenerateVoiceOverTool.js";
import { GetVoiceOverTool } from "./package/services/mcp/tools/GetVoiceOverTool.js";
import { CreateProductionPlanTool } from "./package/services/mcp/tools/CreateProductionPlanTool.js";
import { RenderResultStore } from "./package/services/mcp/rendering/RenderResultStore.js";
import { RenderOutputPathResolver } from "./package/services/mcp/rendering/RenderOutputPathResolver.js";
import { WorkspaceExecutionService } from "./package/services/mcp/workspace/WorkspaceExecutionService.js";
import { VideoEngineImpl } from "./package/services/video-engine/implementations/VideoEngineImpl.js";
import { RemotionBundlerImpl } from "./package/services/video-engine/implementations/remotion/RemotionBundlerImpl.js";
import { RemotionRendererImpl } from "./package/services/video-engine/implementations/remotion/RemotionRendererImpl.js";
import { WorkspaceManagerImpl } from "./package/services/video-engine/implementations/workspace/WorkspaceManagerImpl.js";
import { AssetService } from "./package/services/asset/AssetService.js";
import { ElevenLabsClientImpl } from "./package/services/audio/voice/ElevenLabsClientImpl.js";
import { VoiceServiceImpl } from "./package/services/audio/voice/VoiceServiceImpl.js";
import { MusicServiceImpl } from "./package/services/audio/music/MusicServiceImpl.js";
import { AudioTimelineServiceImpl } from "./package/services/audio/timeline/AudioTimelineServiceImpl.js";
import { ProductionPlanServiceImpl } from "./package/services/audio/production/ProductionPlanServiceImpl.js";

const projectRoot = fileURLToPath(new URL(".", import.meta.url));
const workspaceRoot = join(
  projectRoot,
  "package",
  "services",
  "video-engine",
  "workspace",
);
const renderStorePath = join(projectRoot, "data", "renders.json");
const briefStorePath = join(projectRoot, "data", "video-briefs.json");
const manifestStorePath = join(projectRoot, "data", "asset-manifests.json");
const voiceOverStorePath = join(projectRoot, "data", "voice-overs.json");
const audioTimelineStorePath = join(projectRoot, "data", "audio-timelines.json");
const productionPlanStorePath = join(projectRoot, "data", "production-plans.json");
const outputRoot = join(projectRoot, "output");

export const container = createContainer({
  injectionMode: InjectionMode.CLASSIC,
}).register({
  workspaceRoot: asValue(workspaceRoot),
  renderStorePath: asValue(renderStorePath),
  briefStorePath: asValue(briefStorePath),
  manifestStorePath: asValue(manifestStorePath),
  voiceOverStorePath: asValue(voiceOverStorePath),
  audioTimelineStorePath: asValue(audioTimelineStorePath),
  productionPlanStorePath: asValue(productionPlanStorePath),
  elevenLabsApiKey: asValue(process.env.ELEVENLABS_API_KEY),
  elevenLabsClient: asClass(ElevenLabsClientImpl).singleton(),
  voiceService: asClass(VoiceServiceImpl).singleton(),
  musicService: asClass(MusicServiceImpl).singleton(),
  audioTimelineService: asClass(AudioTimelineServiceImpl).singleton(),
  productionPlanService: asClass(ProductionPlanServiceImpl).singleton(),
  outputRoot: asValue(outputRoot),
  localVideoProjectStore: asClass(LocalVideoProjectStore).singleton(),
  workspaceManager: asClass(WorkspaceManagerImpl).singleton(),
  workspaceFileService: asClass(WorkspaceFileService).singleton(),
  workspaceExecutionService: asClass(WorkspaceExecutionService).singleton(),
  renderResultStore: asClass(RenderResultStore).singleton(),
  renderOutputPathResolver: asClass(RenderOutputPathResolver).singleton(),
  videoBundler: asClass(RemotionBundlerImpl).singleton(),
  videoRenderer: asClass(RemotionRendererImpl).singleton(),
  videoEngine: asClass(VideoEngineImpl).singleton(),
  generateVideoUseCase: asClass(GenerateVideoUseCaseImpl).singleton(),
  videoBriefRepository: asClass(VideoBriefRepositoryImpl).singleton(),
  assetManifestRepository: asClass(AssetManifestRepositoryImpl).singleton(),
  voiceOverRepository: asClass(VoiceOverRepositoryImpl).singleton(),
  audioTimelineRepository: asClass(AudioTimelineRepositoryImpl).singleton(),
  productionPlanRepository: asClass(ProductionPlanRepositoryImpl).singleton(),
  assetService: asClass(AssetService).singleton(),
  createVideoProjectUseCase: asClass(CreateVideoProjectUseCaseImpl).singleton(),
  registerAssetUseCase: asClass(RegisterAssetUseCaseImpl).singleton(),
  updateVideoBriefUseCase: asClass(UpdateVideoBriefUseCaseImpl).singleton(),
  validateVideoProjectUseCase: asClass(ValidateVideoProjectUseCaseImpl).singleton(),
  confirmVideoProjectUseCase: asClass(ConfirmVideoProjectUseCaseImpl).singleton(),
  generateVideoProjectUseCase: asClass(GenerateVideoProjectUseCaseImpl).singleton(),
  generateVoiceOverUseCase: asClass(GenerateVoiceOverUseCaseImpl).singleton(),
  getVoiceOverUseCase: asClass(GetVoiceOverUseCaseImpl).singleton(),
  createProductionPlanUseCase: asClass(CreateProductionPlanUseCaseImpl).singleton(),
  mcpServer: asFunction(
    () => new McpServer({ name: "video-saas", version: "1.0.0" }),
  ).singleton(),
  transport: asFunction(() => new StdioServerTransport()).singleton(),
  inspectDirectoryTool: asClass(InspectDirectoryTool).singleton(),
  createDirectoryTool: asClass(CreateDirectoryTool).singleton(),
  readFileTool: asClass(ReadFileTool).singleton(),
  writeFileTool: asClass(WriteFileTool).singleton(),
  updateFileTool: asClass(UpdateFileTool).singleton(),
  deleteFileTool: asClass(DeleteFileTool).singleton(),
  inspectAssetTool: asClass(InspectAssetTool).singleton(),
  executeCodeTool: asClass(ExecuteCodeTool).singleton(),
  renderVideoTool: asClass(RenderVideoTool).singleton(),
  getRenderResultTool: asClass(GetRenderResultTool).singleton(),
  createVideoProjectTool: asClass(CreateVideoProjectTool).singleton(),
  registerAssetTool: asClass(RegisterAssetTool).singleton(),
  uploadAssetChunkTool: asClass(UploadAssetChunkTool).singleton(),
  updateVideoBriefTool: asClass(UpdateVideoBriefTool).singleton(),
  validateVideoProjectTool: asClass(ValidateVideoProjectTool).singleton(),
  confirmVideoProjectTool: asClass(ConfirmVideoProjectTool).singleton(),
  generateVideoProjectTool: asClass(GenerateVideoProjectTool).singleton(),
  generateVoiceOverTool: asClass(GenerateVoiceOverTool).singleton(),
  getVoiceOverTool: asClass(GetVoiceOverTool).singleton(),
  createProductionPlanTool: asClass(CreateProductionPlanTool).singleton(),
  mcpVideoServer: asClass(McpVideoServer).singleton(),
});
