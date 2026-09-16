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
- Do not inspect the repository architecture; the MCP Tool descriptions and this file are sufficient for the requested video task.

## V2 pre-production rules

The V2 layer qualifies the request before production. Do not start by writing
Remotion code or by calling `render_video`.

The assistant must:

1. Understand the user's request in natural language.
2. Identify the most appropriate video type, objective, platform, format and duration.
3. Ask only for missing information that is required for the selected video type.
4. Ask the user to confirm a proposed video type when it was inferred rather than explicitly provided.
5. Create a project with `create_video_project`.
6. Store the collected information with `update_video_brief`.
7. Register user-provided local assets with `register_asset`.
8. Validate the project with `validate_video_project`.
9. If required information is missing, explain what is missing and wait; do not generate.
10. Present the video plan in natural language with `create_video_plan` and
    `get_video_plan`.
11. Ask the user to approve the plan when approval is needed.
12. Confirm the project with `confirm_video_project`.
13. Only after confirmation, call `generate_video_project`.

Use these discovery tools when the request does not provide enough context:

- `list_video_types`
- `get_video_requirements`

The eight initial video types are:

- `product-presentation`
- `product-promotion`
- `product-demonstration`
- `service-presentation`
- `problem-solution`
- `company-presentation`
- `testimonial`
- `event-promotion`

Required assets must block validation and generation. Recommended assets are
optional and must never block generation. Keep every asset associated with its
`videoId`; do not use assets from another project.

The plan is a human-readable production description, not source code. Do not
present `MainVideo.tsx` or implementation details as the plan.

## Forbidden actions

- Do not modify `tsconfig.json`, `package.json`, `Container.ts`, `Server.ts`, or `PROJECT.md` unless the user explicitly requests a project-level change.
- The only allowed repository-root artifact for a video request is the requested final file under `output/`.
- Do not run broad recursive listings, repository-wide searches, `git` commands, or unrelated diagnostics.
- Do not launch multiple renders, previews, `ffprobe`, or long-running commands unless explicitly requested.
- Do not change workspace isolation or bypass existing MCP path restrictions.
- Do not use shell commands for project inspection, file creation, compilation, or rendering; use the configured MCP Tools.
- Do not run `pnpm`, `tsc`, `remotion`, `rg`, `git`, PowerShell, or any other command during a video request.

## Video workflow

1. Complete the V2 pre-production workflow above.
2. Use the confirmed `videoId` as the only workspace scope.
3. Call `generate_video_project` to delegate to the V1 production engine.
4. If the engine requests source creation, inspect only that workspace.
5. Create the directory `composition` in that workspace.
6. Create exactly `composition/MainVideo.tsx`.
7. Put the complete Remotion entry point in `composition/MainVideo.tsx`.
8. Render once with `compositionId: "MainVideo"` and an output path under root
   `output/`.
9. Verify the returned render result and report the final output path.
10. Stop after the requested video has been produced.

If the request is ambiguous, ask one concise clarification instead of exploring the project.

## MCP tool policy

- Call only the MCP Tools required by the user's request.
- For a new V2 video request, prefer this sequence:
  `list_video_types`/`get_video_requirements` (if needed),
  `create_video_project`, `update_video_brief`, `register_asset` (if needed),
  `validate_video_project`, `create_video_plan`, `get_video_plan`,
  `confirm_video_project`, `generate_video_project`.
- Use `create_directory`, `write_file` or `update_file`, `render_video`, and
  `get_render_result` only when the production engine requires them or when
  the user explicitly requests the lower-level V1 workflow.
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
