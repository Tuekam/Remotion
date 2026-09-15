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
import { McpVideoServer } from "./package/services/mcp/Server.js";
import { WorkspaceFileService } from "./package/services/mcp/WorkspaceFileService.js";
import { CreateDirectoryTool } from "./package/services/mcp/tools/CreateDirectoryTool.js";
import { DeleteFileTool } from "./package/services/mcp/tools/DeleteFileTool.js";
import { InspectAssetTool } from "./package/services/mcp/tools/InspectAssetTool.js";
import { InspectDirectoryTool } from "./package/services/mcp/tools/InspectDirectoryTool.js";
import { ReadFileTool } from "./package/services/mcp/tools/ReadFileTool.js";
import { UpdateFileTool } from "./package/services/mcp/tools/UpdateFileTool.js";
import { WriteFileTool } from "./package/services/mcp/tools/WriteFileTool.js";
import { WorkspaceManagerImpl } from "./package/services/video-engine/workspace/WorkspaceManagerImpl.js";

const projectRoot = fileURLToPath(new URL(".", import.meta.url));
const workspaceRoot = join(
  projectRoot,
  "package",
  "services",
  "video-engine",
  "workspace",
);

export const container = createContainer({
  injectionMode: InjectionMode.CLASSIC,
}).register({
  workspaceRoot: asValue(workspaceRoot),
  workspaceManager: asClass(WorkspaceManagerImpl).singleton(),
  workspaceFileService: asClass(WorkspaceFileService).singleton(),
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
  mcpVideoServer: asClass(McpVideoServer).singleton(),
});
