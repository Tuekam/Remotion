export interface ExecutionResult {
  stdout: string;
  stderr: string;
}

export interface WorkspaceEntry {
  name: string;
  type: "file" | "directory";
}
