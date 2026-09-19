import type {
  CallToolResult,
  Client,
  ListToolsResult,
  Transport,
} from "@modelcontextprotocol/client";
import type {
  McpStdioClientDependencies,
  McpToolCall,
} from "../contracts/McpStdioClient.js";

export class McpStdioClient {
  private connected = false;

  public constructor(
    dependencies: McpStdioClientDependencies,
  ) {
    this.client = dependencies.client;
    this.transport = dependencies.transport;
  }

  private readonly client: Client;
  private readonly transport: Transport;

  public async connect(): Promise<void> {
    if (this.connected) {
      return;
    }

    await this.client.connect(this.transport);
    this.connected = true;
  }

  public async listTools(): Promise<ListToolsResult> {
    this.ensureConnected();
    return this.client.listTools();
  }

  public async callTool(call: McpToolCall): Promise<CallToolResult> {
    this.ensureConnected();
    return this.client.callTool({
      name: call.name,
      arguments: call.arguments,
    });
  }

  public async close(): Promise<void> {
    if (!this.connected) {
      return;
    }

    await this.client.close();
    this.connected = false;
  }

  private ensureConnected(): void {
    if (!this.connected) {
      throw new Error("MCP client is not connected");
    }
  }
}
