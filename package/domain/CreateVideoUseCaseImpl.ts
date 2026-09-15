import type { CreateVideoInput, Video } from "../../core/models/Video.ts";
import type { CreateVideoRepository } from "../../core/repository/CreateVideoRepository.ts";
import type { CreateVideoUseCase } from "../../core/use-case/CreateVideoUseCase.ts";

export class CreateVideoUseCaseImpl implements CreateVideoUseCase {
  public constructor(
    private readonly createVideoRepository: CreateVideoRepository,
  ) {}

  public execute(input: CreateVideoInput): Promise<Video> {
    return this.createVideoRepository.create(input);
  }
}
