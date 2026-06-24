import { Injectable } from '@nestjs/common';
import { IProjectRepository } from '../../application/ports/project.repository.interface';
import { ProjectEntity } from '../../domain/project.entity';
import { PrismaService } from './prisma.service';

@Injectable()
export class ProjectRepositoryImpl implements IProjectRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<ProjectEntity | null> {
    return null;
  }

  async findByWorkspaceId(workspaceId: string): Promise<ProjectEntity[]> {
    return [];
  }

  async create(project: Partial<ProjectEntity>): Promise<ProjectEntity> {
    return new ProjectEntity({
      id: 'uuid',
      ...project,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }

  async update(id: string, project: Partial<ProjectEntity>): Promise<ProjectEntity> {
    return new ProjectEntity({
      id,
      ...project,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }

  async delete(id: string): Promise<boolean> {
    return true;
  }
}
