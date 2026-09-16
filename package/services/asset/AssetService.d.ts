import type { Asset } from "../../../core/models/Asset.js";
import type { AssetManifest } from "../../../core/models/AssetManifest.js";
import type { AssetKey } from "../../../core/models/VideoType.js";
import type { WorkspaceManager } from "../video-engine/contracts/WorkspaceManager.js";
export declare class AssetService {
    private readonly workspaceManager;
    constructor(workspaceManager: WorkspaceManager);
    register(videoId: string, sourcePath: string, type: Asset["type"], name: string, key: AssetKey | null, manifest: AssetManifest): Promise<{
        asset: Asset;
        manifest: AssetManifest;
    }>;
}
//# sourceMappingURL=AssetService.d.ts.map