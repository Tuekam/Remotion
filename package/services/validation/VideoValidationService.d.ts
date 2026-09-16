import type { AssetManifest } from "../../../core/models/AssetManifest.js";
import type { ValidationReport } from "../../../core/models/ValidationReport.js";
import type { VideoBrief } from "../../../core/models/VideoBrief.js";
import type { VideoTypeDefinition } from "../../../core/models/VideoType.js";
export declare class VideoValidationService {
    validate(brief: VideoBrief, manifest: AssetManifest, definition: VideoTypeDefinition): ValidationReport;
}
//# sourceMappingURL=VideoValidationService.d.ts.map