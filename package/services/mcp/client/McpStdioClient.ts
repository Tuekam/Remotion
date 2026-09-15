import { Client } from "@modelcontextprotocol/client";
import {
  StdioClientTransport,
  type StdioServerParameters,
} from "@modelcontextprotocol/client/stdio";
import type {
  CallToolResult,
  ListToolsResult,
} from "@modelcontextprotocol/client";

export interface McpToolCall {
  name: string;
  arguments?: Record<string, unknown>;
}

export class McpStdioClient {
  private readonly client: Client;
  private readonly transport: StdioClientTransport;
  private connected = false;

  public constructor(
    server: StdioServerParameters,
    clientInfo = { name: "video-saas-client", version: "1.0.0" },
  ) {
    this.client = new Client(clientInfo);
    this.transport = new StdioClientTransport(server);
  }

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
