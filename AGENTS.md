# Agent execution rules

## Startup command

From PowerShell, launch Codex from the repository root with:

```powershell
codex.cmd --approve-for-me -C "C:\Users\PROMOPlus\Documents\video-saas"
```

`--approve-for-me` is required for MCP Tools that create, update, render, or delete files. Do not add `--sandbox` together with this option.

## Scope

- Work only on the user's explicit request.
- For video generation requests, use only the configured `video-saas` MCP server.
- Keep all generated source files inside the requested `videoId` workspace.
- The final rendered video must be written to the repository root `output/` directory.
- Use an output path such as `output/video01.mp4`; never write a final video inside the workspace `output/` directory.
- This file is the only project instruction file to read for video-generation requests.
- Do not read `PROJECT.md`, `README.md`, source files outside the requested workspace, git history, or any other project documentation.
- Do not inspect the repository architecture; the MCP Tool descriptions are sufficient for the requested video task.

## Forbidden actions

- Do not modify `tsconfig.json`, `package.json`, `Container.ts`, `Server.ts`, or `PROJECT.md` unless the user explicitly requests a project-level change.
- The only allowed repository-root artifact for a video request is the requested final file under `output/`.
- Do not run broad recursive listings, repository-wide searches, `git` commands, or unrelated diagnostics.
- Do not launch multiple renders, previews, `ffprobe`, or long-running commands unless explicitly requested.
- Do not change workspace isolation or bypass existing MCP path restrictions.
- Do not use shell commands for project inspection, file creation, compilation, or rendering; use the configured MCP Tools.
- Do not run `pnpm`, `tsc`, `remotion`, `rg`, `git`, PowerShell, or any other command during a video request.

## Video workflow

1. Use the requested `videoId` as the only workspace scope.
2. Inspect only that workspace.
3. Create the directory `composition` in that workspace.
4. Create exactly `composition/MainVideo.tsx`.
5. Put the complete Remotion entry point in `composition/MainVideo.tsx`.
6. Render once with `compositionId: "MainVideo"` and an output path under root `output/`.
7. Report the result and stop.

If the request is ambiguous, ask one concise clarification instead of exploring the project.

## MCP tool policy

- Call only the MCP Tools required by the user's request.
- For a normal video request, prefer this sequence: `create_directory`, `write_file` or `update_file`, `render_video`, then `get_render_result`.
- Use `read_file` or `inspect_directory` only when needed to continue the requested task.
- If rendering fails, inspect the returned error, correct only the relevant workspace file with `update_file`, and retry the render once.
- Never create a preview, alternate resolution, duplicate output, or second render unless the user explicitly asks.
- Do not inspect or modify files outside the requested `videoId` workspace.

## Remotion requirements

- The VideoEngine always bundles `composition/MainVideo.tsx`; do not create `src/`, `Root.tsx`, `index.ts`, or another entry point.
- `composition/MainVideo.tsx` must call `registerRoot(...)`.
- The file must define a component with the requested composition id, normally `MainVideo`.
- Use `Composition` with explicit `durationInFrames`, `fps`, `width`, and `height`.
- For a 15-second video at 30 fps, use `durationInFrames: 450` and `fps: 30`.
- Keep all imports in this single file whenever possible; do not use extensionless local imports.
- Do not use unsupported or accidental identifiers, non-ASCII misspellings, or undeclared variables.
- Do not run TypeScript or Remotion from the shell; `render_video` performs the bundling and validation.

## Output requirements

- `outputPath` must be repository-root-relative and begin with `output/`.
- Use one deterministic filename, for example `output/video01.mp4`.
- Do not create `output/` through filesystem Tools; it already belongs to the repository root.
- Do not create preview images or temporary render files.
