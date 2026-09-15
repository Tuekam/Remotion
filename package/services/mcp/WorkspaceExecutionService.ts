import { execFile } from "node:child_process";
import { promisify } from "node:util";
import type { WorkspaceManager } from "../video-engine/contracts/WorkspaceManager.js";

const execFileAsync = promisify(execFile);
const ALLOWED_COMMANDS = new Set(["pnpm"]);

export interface ExecutionResult {
  stdout: string;
  stderr: string;
}

export class WorkspaceExecutionService {
  public constructor(private readonly workspaceManager: WorkspaceManager) {}

  public async execute(
    videoId: string,
    command: string,
    args: string[],
  ): Promise<ExecutionResult> {
    if (!ALLOWED_COMMANDS.has(command)) {
      throw new Error(`Command is not allowed: ${command}`);
    }

    const workspace = await this.workspaceManager.get(videoId);
    const result = await execFileAsync(command, args, {
      cwd: workspace.path,
      shell: false,
      windowsHide: true,
    });

    return {
      stdout: result.stdout,
      stderr: result.stderr,
    };
  }
}
