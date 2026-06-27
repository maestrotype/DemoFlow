import { Inject, Injectable } from '@nestjs/common';
import { IProjectRepository } from '../ports/project.repository.interface';
import { ProjectEntity } from '../../domain/project.entity';

@Injectable()
export class CreateProjectUseCase {
  constructor(
    @Inject('IProjectRepository')
    private readonly projectRepository: IProjectRepository
  ) {}

  async execute(workspaceId: string, title: string, description?: string): Promise<ProjectEntity> {
    // Empty skeleton structure
    return this.projectRepository.create({
      workspaceId,
      title,
      description,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }
}
