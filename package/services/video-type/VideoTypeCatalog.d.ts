import type { VideoTypeDefinition, VideoTypeId } from "../../../core/models/VideoType.js";
export declare class VideoTypeCatalog {
    private readonly definitions;
    list(): readonly VideoTypeDefinition[];
    get(id: VideoTypeId): VideoTypeDefinition;
}
//# sourceMappingURL=VideoTypeCatalog.d.ts.map