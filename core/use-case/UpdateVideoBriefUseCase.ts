import type { VideoBrief, VideoBriefStatus } from "../models/VideoBrief.js";
import type { VideoTypeId } from "../models/VideoType.js";

export interface UpdateVideoBriefInput {
  type?: VideoTypeId | null | undefined;
  objective?: string | null | undefined;
  platform?: string | null | undefined;
  format?: string | null | undefined;
  durationInSeconds?: number | null | undefined;
  language?: string | null | undefined;
  product?: string | null | undefined;
  name?: string | null | undefined;
  description?: string | null | undefined;
  features?: string[] | undefined;
  service?: string | null | undefined;
  company?: string | null | undefined;
  activity?: string | null | undefined;
  valueProposition?: string | null | undefined;
  offer?: string | null | undefined;
  price?: string | null | undefined;
  callToAction?: string | null | undefined;
  targetAudience?: string | null | undefined;
  problem?: string | null | undefined;
  solution?: string | null | undefined;
  howItWorks?: string | null | undefined;
  benefits?: string[] | undefined;
  brand?: string | null | undefined;
  client?: string | null | undefined;
  experience?: string | null | undefined;
  initialProblem?: string | null | undefined;
  result?: string | null | undefined;
  eventDate?: string | null | undefined;
  locationOrLink?: string | null | undefined;
  status?: VideoBriefStatus | undefined;
}

export interface UpdateVideoBriefUseCase {
  execute(videoId: string, input: UpdateVideoBriefInput): Promise<VideoBrief>;
}
