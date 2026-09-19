/** Contrat des données ExecutionResult utilisé dans le domaine vidéo. */
export interface ExecutionResult {
  stdout: string;
  stderr: string;
}

/** Contrat des données WorkspaceEntry utilisé dans le domaine vidéo. */
export interface WorkspaceEntry {
  name: string;
  type: "file" | "directory";
}
