import type { VideoTypeId } from "./VideoType.js";

export type VideoBriefStatus =
  | "incomplete"
  | "ready-for-confirmation"
  | "ready-for-generation";

export interface VideoBrief {
  id: string;
  type: VideoTypeId | null;
  objective: string | null;
  platform: string | null;
  format: string | null;
  durationInSeconds: number | null;
  language: string | null;
  product: string | null;
  name: string | null;
  description: string | null;
  features: string[];
  service: string | null;
  company: string | null;
  activity: string | null;
  valueProposition: string | null;
  offer: string | null;
  price: string | null;
  callToAction: string | null;
  targetAudience: string | null;
  problem: string | null;
  solution: string | null;
  howItWorks: string | null;
  client: string | null;
  experience: string | null;
  initialProblem: string | null;
  result: string | null;
  eventDate: string | null;
  locationOrLink: string | null;
  benefits: string[];
  brand: string | null;
  assetIds: string[];
  status: VideoBriefStatus;
  typeConfirmed: boolean;
  createdAt: Date;
  updatedAt: Date;
}
