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
import { LocalVideoStore } from "./package/data/database/LocalVideoStore.js";
import { CreateVideoRepositoryImpl } from "./package/data/repositories/CreateVideoRepositoryImpl.js";
import { DeleteVideoRepositoryImpl } from "./package/data/repositories/DeleteVideoRepositoryImpl.js";
import { GetVideoRepositoryImpl } from "./package/data/repositories/GetVideoRepositoryImpl.js";
import { UpdateVideoRepositoryImpl } from "./package/data/repositories/UpdateVideoRepositoryImpl.js";
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
import { RenderResultStore } from "./package/services/mcp/RenderResultStore.js";
import { WorkspaceExecutionService } from "./package/services/mcp/WorkspaceExecutionService.js";
import { VideoEngineImpl } from "./package/services/video-engine/VideoEngineImpl.js";
import { GenerateVideoServiceImpl } from "./package/services/video-engine/GenerateVideoServiceImpl.js";
import { RemotionBundlerImpl } from "./package/services/video-engine/runtime/RemotionBundlerImpl.js";
import { RemotionRendererImpl } from "./package/services/video-engine/runtime/RemotionRendererImpl.js";
import { WorkspaceManagerImpl } from "./package/services/video-engine/workspace/WorkspaceManagerImpl.js";

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
const outputRoot = join(projectRoot, "output");

export const container = createContainer({
  injectionMode: InjectionMode.CLASSIC,
}).register({
  workspaceRoot: asValue(workspaceRoot),
  videoStorePath: asValue(videoStorePath),
  renderStorePath: asValue(renderStorePath),
  outputRoot: asValue(outputRoot),
  localVideoStore: asClass(LocalVideoStore).singleton(),
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
  videoBundler: asClass(RemotionBundlerImpl).singleton(),
  videoRenderer: asClass(RemotionRendererImpl).singleton(),
  videoEngine: asClass(VideoEngineImpl).singleton(),
  generateVideoService: asClass(GenerateVideoServiceImpl).singleton(),
  generateVideoUseCase: asClass(GenerateVideoUseCaseImpl).singleton(),
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
  mcpVideoServer: asClass(McpVideoServer).singleton(),
});
