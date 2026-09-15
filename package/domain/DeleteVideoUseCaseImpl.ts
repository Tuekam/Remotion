import type { DeleteVideoRepository } from "../../core/repository/DeleteVideoRepository.ts";
import type { DeleteVideoUseCase } from "../../core/use-case/DeleteVideoUseCase.ts";

export class DeleteVideoUseCaseImpl implements DeleteVideoUseCase {
  public constructor(
    private readonly deleteVideoRepository: DeleteVideoRepository,
  ) {}

  public execute(id: string): Promise<boolean> {
    return this.deleteVideoRepository.delete(id);
  }
}
