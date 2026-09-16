import type { AssetManifest } from "../../../core/models/AssetManifest.js";
import type { VideoBrief } from "../../../core/models/VideoBrief.js";
import type { VideoPlan } from "../../../core/models/VideoPlan.js";
import type { VideoTypeDefinition } from "../../../core/models/VideoType.js";

export class VideoPlanningService {
  public create(
    brief: VideoBrief,
    manifest: AssetManifest,
    definition: VideoTypeDefinition,
  ): VideoPlan {
    if (brief.status !== "ready-for-generation") {
      throw new Error("Video brief is not ready for planning");
    }
    const now = new Date();
    return {
      id: `${brief.id}-plan`,
      videoId: brief.id,
      videoType: definition.id,
      summary: `${definition.name}: ${definition.objective}`,
      narrative: definition.narrativeGuidance.join(" "),
      callToAction: brief.callToAction,
      visualDirection: manifest.assets.length > 0
        ? "Utiliser les assets fournis dans le workspace du projet."
        : "Créer une direction visuelle cohérente à partir du brief.",
      scenes: [],
      createdAt: now,
      updatedAt: now,
    };
  }
}
