import { container } from "./Container.js";
import type { McpVideoServer } from "./package/services/mcp/Server.js";

const server = container.resolve<McpVideoServer>("mcpVideoServer");
await server.start();
