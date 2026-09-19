import type { Client, Transport } from "@modelcontextprotocol/client";

export interface McpToolCall {
  name: string;
  arguments?: Record<string, unknown>;
}

export interface McpStdioClientDependencies {
  client: Client;
  transport: Transport;
}
