import type { Video } from "../../core/models/Video.ts";
import type { GetVideoRepository } from "../../core/repository/GetVideoRepository.ts";
import type { GetVideoUseCase } from "../../core/use-case/GetVideoUseCase.ts";

export class GetVideoUseCaseImpl implements GetVideoUseCase {
  public constructor(
    private readonly getVideoRepository: GetVideoRepository,
  ) {}

  public execute(id: string): Promise<Video | null> {
    return this.getVideoRepository.getById(id);
  }
}
