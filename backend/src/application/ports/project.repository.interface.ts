import { ProjectEntity } from '../../domain/project.entity';

export interface IProjectRepository {
  findById(id: string): Promise<ProjectEntity | null>;
  findByWorkspaceId(workspaceId: string): Promise<ProjectEntity[]>;
  create(project: Partial<ProjectEntity>): Promise<ProjectEntity>;
  update(id: string, project: Partial<ProjectEntity>): Promise<ProjectEntity>;
  delete(id: string): Promise<boolean>;
}
