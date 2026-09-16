import type { VideoBrief } from "../../core/models/VideoBrief.js";
import type {
  UpdateVideoBriefInput,
  UpdateVideoBriefUseCase,
} from "../../core/use-case/UpdateVideoBriefUseCase.js";
import type { VideoBriefRepository } from "../../core/repository/VideoBriefRepository.js";

export class UpdateVideoBriefUseCaseImpl implements UpdateVideoBriefUseCase {
  public constructor(
    private readonly videoBriefRepository: VideoBriefRepository,
  ) {}

  public async execute(
    videoId: string,
    input: UpdateVideoBriefInput,
  ): Promise<VideoBrief> {
    const current = await this.videoBriefRepository.getByVideoId(videoId);
    if (!current) {
      throw new Error(`Video brief not found: ${videoId}`);
    }

    const updated: VideoBrief = {
      ...current,
      type: input.type === undefined ? current.type : input.type,
      objective: input.objective === undefined ? current.objective : input.objective,
      platform: input.platform === undefined ? current.platform : input.platform,
      format: input.format === undefined ? current.format : input.format,
      durationInSeconds:
        input.durationInSeconds === undefined
          ? current.durationInSeconds
          : input.durationInSeconds,
      language: input.language === undefined ? current.language : input.language,
      product: input.product === undefined ? current.product : input.product,
      name: input.name === undefined ? current.name : input.name,
      description:
        input.description === undefined ? current.description : input.description,
      features: input.features === undefined ? current.features : input.features,
      service: input.service === undefined ? current.service : input.service,
      company: input.company === undefined ? current.company : input.company,
      activity: input.activity === undefined ? current.activity : input.activity,
      valueProposition:
        input.valueProposition === undefined
          ? current.valueProposition
          : input.valueProposition,
      offer: input.offer === undefined ? current.offer : input.offer,
      price: input.price === undefined ? current.price : input.price,
      callToAction:
        input.callToAction === undefined ? current.callToAction : input.callToAction,
      targetAudience:
        input.targetAudience === undefined
          ? current.targetAudience
          : input.targetAudience,
      problem: input.problem === undefined ? current.problem : input.problem,
      solution: input.solution === undefined ? current.solution : input.solution,
      howItWorks:
        input.howItWorks === undefined ? current.howItWorks : input.howItWorks,
      benefits: input.benefits === undefined ? current.benefits : input.benefits,
      brand: input.brand === undefined ? current.brand : input.brand,
      client: input.client === undefined ? current.client : input.client,
      experience:
        input.experience === undefined ? current.experience : input.experience,
      initialProblem:
        input.initialProblem === undefined
          ? current.initialProblem
          : input.initialProblem,
      result: input.result === undefined ? current.result : input.result,
      eventDate: input.eventDate === undefined ? current.eventDate : input.eventDate,
      locationOrLink:
        input.locationOrLink === undefined
          ? current.locationOrLink
          : input.locationOrLink,
      status: input.status === undefined ? current.status : input.status,
      updatedAt: new Date(),
    };
    return this.videoBriefRepository.update(updated);
  }
}
