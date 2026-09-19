import { execFile } from "node:child_process";
import { promisify } from "node:util";
import type { WorkspaceManager } from "../../../../core/service/WorkspaceManager.js";
import type { ExecutionResult } from "../contracts/WorkspaceServices.js";

const execFileAsync = promisify(execFile);
const ALLOWED_COMMANDS = new Set(["pnpm"]);
const ALLOWED_PNPM_ARGUMENTS = new Set(["--version", "-v"]);
const ALLOWED_EXECUTABLES = new Set(["tsc", "tsx", "remotion"]);
const MAX_ARGUMENT_LENGTH = 256;
const UNSAFE_ARGUMENT_PATTERN = /[;&|<>`$(){}\r\n]/;

/** Orchestre les opérations du composant WorkspaceExecutionService dans le flux applicatif. */
export class WorkspaceExecutionService {
/** Initialise l’instance avec les dépendances injectées nécessaires à son rôle. */
  public constructor(private readonly workspaceManager: WorkspaceManager) {}

/** Exécute le cas d’usage avec les données reçues et retourne son résultat. */
  public async execute(
    videoId: string,
    command: string,
    args: string[],
  ): Promise<ExecutionResult> {
    if (!ALLOWED_COMMANDS.has(command)) {
      throw new Error(`Command is not allowed: ${command}`);
    }

    validateArguments(args);

    const workspace = await this.workspaceManager.get(videoId);
    const executable = process.platform === "win32" ? `${command}.cmd` : command;
    const result = await execFileAsync(executable, args, {
      cwd: workspace.path,
      shell: process.platform === "win32",
      windowsHide: true,
    });

    return {
      stdout: result.stdout,
      stderr: result.stderr,
    };
  }
}

/** Contrôle les arguments de commande avant leur exécution dans l’espace de travail isolé. */
function validateArguments(args: string[]): void {
  if (args.length === 0 || args.length > 20) {
    throw new Error("Invalid command arguments");
  }

  for (const argument of args) {
    if (
      argument.length === 0 ||
      argument.length > MAX_ARGUMENT_LENGTH ||
      UNSAFE_ARGUMENT_PATTERN.test(argument)
    ) {
      throw new Error("Command argument is not allowed");
    }
  }

  const firstArgument = args[0];
  const executable = args[1];

  if (firstArgument !== undefined && ALLOWED_PNPM_ARGUMENTS.has(firstArgument)) {
    if (args.length !== 1) {
      throw new Error("The pnpm version command does not accept extra arguments");
    }
    return;
  }

  if (firstArgument !== "exec" || executable === undefined) {
    throw new Error("Only pnpm --version and pnpm exec are allowed");
  }

  if (!ALLOWED_EXECUTABLES.has(executable)) {
    throw new Error(`Executable is not allowed: ${executable}`);
  }
}
