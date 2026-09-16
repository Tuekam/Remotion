import type { Client, Transport } from "@modelcontextprotocol/client";
import type {
  CallToolResult,
  ListToolsResult,
} from "@modelcontextprotocol/client";

export interface McpToolCall {
  name: string;
  arguments?: Record<string, unknown>;
}

export interface McpStdioClientDependencies {
  client: Client;
  transport: Transport;
}

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
