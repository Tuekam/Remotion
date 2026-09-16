export type VideoTypeId =
  | "product-presentation"
  | "product-promotion"
  | "product-demo"
  | "service-presentation"
  | "problem-solution"
  | "company-presentation"
  | "testimonial"
  | "event-promotion";

export type RequirementLevel = "required" | "recommended" | "optional";

export type InformationKey =
  | "product"
  | "name"
  | "description"
  | "features"
  | "benefits"
  | "offer"
  | "price"
  | "callToAction"
  | "howItWorks"
  | "service"
  | "targetAudience"
  | "valueProposition"
  | "problem"
  | "solution"
  | "company"
  | "activity"
  | "client"
  | "experience"
  | "initialProblem"
  | "result"
  | "eventDate"
  | "locationOrLink"
  | "objective";

export type AssetKind = "image" | "video" | "audio" | "document";

export type AssetKey =
  | "productVisual"
  | "productDemo"
  | "logo"
  | "promotionalVisual"
  | "serviceVisual"
  | "companyVisual"
  | "testimonial"
  | "clientPhoto"
  | "proof"
  | "eventPoster"
  | "speakerVisual"
  | "program";

export interface InformationRequirement {
  key: InformationKey;
  level: RequirementLevel;
  description: string;
}

export interface AssetRequirement {
  key: AssetKey;
  kind: AssetKind;
  level: RequirementLevel;
  description: string;
}

export interface VideoTypeDefinition {
  id: VideoTypeId;
  name: string;
  description: string;
  objective: string;
  informationRequirements: InformationRequirement[];
  assetRequirements: AssetRequirement[];
  supportedPlatforms: string[];
  supportedFormats: string[];
  recommendedDurationInSeconds: number;
  narrativeGuidance: string[];
}
