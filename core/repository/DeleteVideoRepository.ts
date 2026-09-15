export interface DeleteVideoRepository {
  delete(id: string): Promise<boolean>;
}