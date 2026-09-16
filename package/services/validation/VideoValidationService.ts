import type { AssetManifest } from "../../../core/models/AssetManifest.js";
import type { ValidationReport } from "../../../core/models/ValidationReport.js";
import type { VideoBrief } from "../../../core/models/VideoBrief.js";
import type {
  InformationRequirement,
  VideoTypeDefinition,
} from "../../../core/models/VideoType.js";

export class VideoValidationService {
  public validate(
    brief: VideoBrief,
    manifest: AssetManifest,
    definition: VideoTypeDefinition,
  ): ValidationReport {
    const missingRequiredInformation = definition.informationRequirements
      .filter((requirement) => requirement.level === "required")
      .filter((requirement) => !hasInformation(brief, requirement))
      .map((requirement) => requirement.key);
    const missingRecommendedInformation = definition.informationRequirements
      .filter((requirement) => requirement.level === "recommended")
      .filter((requirement) => !hasInformation(brief, requirement))
      .map((requirement) => requirement.key);
    const availableAssetKeys = new Set(
      manifest.assets.flatMap((asset) => (asset.key ? [asset.key] : [])),
    );
    const missingRequiredAssets = definition.assetRequirements
      .filter((requirement) => requirement.level === "required")
      .filter((requirement) => !availableAssetKeys.has(requirement.key))
      .map((requirement) => requirement.key);
    const missingRecommendedAssets = definition.assetRequirements
      .filter((requirement) => requirement.level === "recommended")
      .filter((requirement) => !availableAssetKeys.has(requirement.key))
      .map((requirement) => requirement.key);

    const canGenerate =
      missingRequiredInformation.length === 0 &&
      missingRequiredAssets.length === 0 &&
      brief.typeConfirmed;
    return {
      status: canGenerate ? "ready" : "incomplete",
      canGenerate,
      missingRequiredInformation,
      missingRequiredAssets,
      missingRecommendedInformation,
      missingRecommendedAssets,
      warnings: brief.typeConfirmed ? [] : ["Video type is not confirmed"],
    };
  }
}

function hasInformation(
  brief: VideoBrief,
  requirement: InformationRequirement,
): boolean {
  const value = brief[requirement.key];
  if (Array.isArray(value)) {
    return value.length > 0;
  }
  return typeof value === "string" ? value.trim().length > 0 : value !== null;
}
