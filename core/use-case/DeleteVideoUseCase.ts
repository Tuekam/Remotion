export interface DeleteVideoUseCase {
  execute(id: string): Promise<boolean>;
}