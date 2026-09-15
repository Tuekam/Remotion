import type { UpdateVideoInput, Video } from "../../core/models/Video.ts";
import type { UpdateVideoRepository } from "../../core/repository/UpdateVideoRepository.ts";
import type { UpdateVideoUseCase } from "../../core/use-case/UpdateVideoUseCase.ts";

export class UpdateVideoUseCaseImpl implements UpdateVideoUseCase {
  public constructor(
    private readonly updateVideoRepository: UpdateVideoRepository,
  ) {}

  public execute(id: string, input: UpdateVideoInput): Promise<Video | null> {
    return this.updateVideoRepository.update(id, input);
  }
}
