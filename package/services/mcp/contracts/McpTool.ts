import type { McpServer } from "@modelcontextprotocol/server";

/** Contrat des données McpTool utilisé dans le domaine vidéo. */
export interface McpTool {
  register(server: McpServer): void;
}
