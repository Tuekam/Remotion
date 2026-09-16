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
import { CreateVideoUseCaseImpl } from "./package/domain/CreateVideoUseCaseImpl.js";
import { DeleteVideoUseCaseImpl } from "./package/domain/DeleteVideoUseCaseImpl.js";
import { GetVideoUseCaseImpl } from "./package/domain/GetVideoUseCaseImpl.js";
import { UpdateVideoUseCaseImpl } from "./package/domain/UpdateVideoUseCaseImpl.js";
import { GenerateVideoUseCaseImpl } from "./package/domain/GenerateVideoUseCaseImpl.js";
import { CreateVideoPlanUseCaseImpl } from "./package/domain/CreateVideoPlanUseCaseImpl.js";
import { CreateVideoProjectUseCaseImpl } from "./package/domain/CreateVideoProjectUseCaseImpl.js";
import { ConfirmVideoProjectUseCaseImpl } from "./package/domain/ConfirmVideoProjectUseCaseImpl.js";
import { GetVideoRequirementsUseCaseImpl } from "./package/domain/GetVideoRequirementsUseCaseImpl.js";
import { ListVideoTypesUseCaseImpl } from "./package/domain/ListVideoTypesUseCaseImpl.js";
import { RegisterAssetUseCaseImpl } from "./package/domain/RegisterAssetUseCaseImpl.js";
import { UpdateVideoBriefUseCaseImpl } from "./package/domain/UpdateVideoBriefUseCaseImpl.js";
import { GetVideoPlanUseCaseImpl } from "./package/domain/GetVideoPlanUseCaseImpl.js";
import { GenerateVideoProjectUseCaseImpl } from "./package/domain/GenerateVideoProjectUseCaseImpl.js";
import { ValidateVideoProjectUseCaseImpl } from "./package/domain/ValidateVideoProjectUseCaseImpl.js";
import { LocalVideoStore } from "./package/data/database/LocalVideoStore.js";
import { LocalVideoProjectStore } from "./package/data/database/LocalVideoProjectStore.js";
import { CreateVideoRepositoryImpl } from "./package/data/repositories/CreateVideoRepositoryImpl.js";
import { DeleteVideoRepositoryImpl } from "./package/data/repositories/DeleteVideoRepositoryImpl.js";
import { GetVideoRepositoryImpl } from "./package/data/repositories/GetVideoRepositoryImpl.js";
import { UpdateVideoRepositoryImpl } from "./package/data/repositories/UpdateVideoRepositoryImpl.js";
import { AssetManifestRepositoryImpl } from "./package/data/repositories/AssetManifestRepositoryImpl.js";
import { VideoBriefRepositoryImpl } from "./package/data/repositories/VideoBriefRepositoryImpl.js";
import { VideoPlanRepositoryImpl } from "./package/data/repositories/VideoPlanRepositoryImpl.js";
import { McpVideoServer } from "./package/services/mcp/Server.js";
import { WorkspaceFileService } from "./package/services/mcp/WorkspaceFileService.js";
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
import { ListVideoTypesTool } from "./package/services/mcp/tools/ListVideoTypesTool.js";
import { GetVideoRequirementsTool } from "./package/services/mcp/tools/GetVideoRequirementsTool.js";
import { CreateVideoProjectTool } from "./package/services/mcp/tools/CreateVideoProjectTool.js";
import { RegisterAssetTool } from "./package/services/mcp/tools/RegisterAssetTool.js";
import { UpdateVideoBriefTool } from "./package/services/mcp/tools/UpdateVideoBriefTool.js";
import { ValidateVideoProjectTool } from "./package/services/mcp/tools/ValidateVideoProjectTool.js";
import { CreateVideoPlanTool } from "./package/services/mcp/tools/CreateVideoPlanTool.js";
import { ConfirmVideoProjectTool } from "./package/services/mcp/tools/ConfirmVideoProjectTool.js";
import { GetVideoPlanTool } from "./package/services/mcp/tools/GetVideoPlanTool.js";
import { GenerateVideoProjectTool } from "./package/services/mcp/tools/GenerateVideoProjectTool.js";
import { RenderResultStore } from "./package/services/mcp/RenderResultStore.js";
import { RenderOutputPathResolver } from "./package/services/mcp/RenderOutputPathResolver.js";
import { WorkspaceExecutionService } from "./package/services/mcp/WorkspaceExecutionService.js";
import { VideoEngineImpl } from "./package/services/video-engine/VideoEngineImpl.js";
import { GenerateVideoServiceImpl } from "./package/services/video-engine/GenerateVideoServiceImpl.js";
import { RemotionBundlerImpl } from "./package/services/video-engine/runtime/RemotionBundlerImpl.js";
import { RemotionRendererImpl } from "./package/services/video-engine/runtime/RemotionRendererImpl.js";
import { WorkspaceManagerImpl } from "./package/services/video-engine/workspace/WorkspaceManagerImpl.js";
import { AssetService } from "./package/services/asset/AssetService.js";
import { VideoPlanningService } from "./package/services/video-planning/VideoPlanningService.js";
import { VideoTypeCatalog } from "./package/services/video-type/VideoTypeCatalog.js";
import { VideoValidationService } from "./package/services/validation/VideoValidationService.js";

const projectRoot = fileURLToPath(new URL(".", import.meta.url));
const workspaceRoot = join(
  projectRoot,
  "package",
  "services",
  "video-engine",
  "workspace",
);
const videoStorePath = join(projectRoot, "data", "videos.json");
const renderStorePath = join(projectRoot, "data", "renders.json");
const briefStorePath = join(projectRoot, "data", "video-briefs.json");
const manifestStorePath = join(projectRoot, "data", "asset-manifests.json");
const planStorePath = join(projectRoot, "data", "video-plans.json");
const outputRoot = join(projectRoot, "output");

export const container = createContainer({
  injectionMode: InjectionMode.CLASSIC,
}).register({
  workspaceRoot: asValue(workspaceRoot),
  videoStorePath: asValue(videoStorePath),
  renderStorePath: asValue(renderStorePath),
  briefStorePath: asValue(briefStorePath),
  manifestStorePath: asValue(manifestStorePath),
  planStorePath: asValue(planStorePath),
  outputRoot: asValue(outputRoot),
  localVideoStore: asClass(LocalVideoStore).singleton(),
  localVideoProjectStore: asClass(LocalVideoProjectStore).singleton(),
  createVideoRepository: asClass(CreateVideoRepositoryImpl).singleton(),
  getVideoRepository: asClass(GetVideoRepositoryImpl).singleton(),
  updateVideoRepository: asClass(UpdateVideoRepositoryImpl).singleton(),
  deleteVideoRepository: asClass(DeleteVideoRepositoryImpl).singleton(),
  createVideoUseCase: asClass(CreateVideoUseCaseImpl).singleton(),
  getVideoUseCase: asClass(GetVideoUseCaseImpl).singleton(),
  updateVideoUseCase: asClass(UpdateVideoUseCaseImpl).singleton(),
  deleteVideoUseCase: asClass(DeleteVideoUseCaseImpl).singleton(),
  workspaceManager: asClass(WorkspaceManagerImpl).singleton(),
  workspaceFileService: asClass(WorkspaceFileService).singleton(),
  workspaceExecutionService: asClass(WorkspaceExecutionService).singleton(),
  renderResultStore: asClass(RenderResultStore).singleton(),
  renderOutputPathResolver: asClass(RenderOutputPathResolver).singleton(),
  videoBundler: asClass(RemotionBundlerImpl).singleton(),
  videoRenderer: asClass(RemotionRendererImpl).singleton(),
  videoEngine: asClass(VideoEngineImpl).singleton(),
  generateVideoService: asClass(GenerateVideoServiceImpl).singleton(),
  generateVideoUseCase: asClass(GenerateVideoUseCaseImpl).singleton(),
  videoBriefRepository: asClass(VideoBriefRepositoryImpl).singleton(),
  assetManifestRepository: asClass(AssetManifestRepositoryImpl).singleton(),
  videoPlanRepository: asClass(VideoPlanRepositoryImpl).singleton(),
  videoTypeCatalog: asClass(VideoTypeCatalog).singleton(),
  assetService: asClass(AssetService).singleton(),
  videoValidationService: asClass(VideoValidationService).singleton(),
  videoPlanningService: asClass(VideoPlanningService).singleton(),
  listVideoTypesUseCase: asClass(ListVideoTypesUseCaseImpl).singleton(),
  getVideoRequirementsUseCase: asClass(GetVideoRequirementsUseCaseImpl).singleton(),
  createVideoProjectUseCase: asClass(CreateVideoProjectUseCaseImpl).singleton(),
  registerAssetUseCase: asClass(RegisterAssetUseCaseImpl).singleton(),
  updateVideoBriefUseCase: asClass(UpdateVideoBriefUseCaseImpl).singleton(),
  validateVideoProjectUseCase: asClass(ValidateVideoProjectUseCaseImpl).singleton(),
  createVideoPlanUseCase: asClass(CreateVideoPlanUseCaseImpl).singleton(),
  confirmVideoProjectUseCase: asClass(ConfirmVideoProjectUseCaseImpl).singleton(),
  getVideoPlanUseCase: asClass(GetVideoPlanUseCaseImpl).singleton(),
  generateVideoProjectUseCase: asClass(GenerateVideoProjectUseCaseImpl).singleton(),
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
  listVideoTypesTool: asClass(ListVideoTypesTool).singleton(),
  getVideoRequirementsTool: asClass(GetVideoRequirementsTool).singleton(),
  createVideoProjectTool: asClass(CreateVideoProjectTool).singleton(),
  registerAssetTool: asClass(RegisterAssetTool).singleton(),
  updateVideoBriefTool: asClass(UpdateVideoBriefTool).singleton(),
  validateVideoProjectTool: asClass(ValidateVideoProjectTool).singleton(),
  createVideoPlanTool: asClass(CreateVideoPlanTool).singleton(),
  confirmVideoProjectTool: asClass(ConfirmVideoProjectTool).singleton(),
  getVideoPlanTool: asClass(GetVideoPlanTool).singleton(),
  generateVideoProjectTool: asClass(GenerateVideoProjectTool).singleton(),
  mcpVideoServer: asClass(McpVideoServer).singleton(),
});
