import { Module } from '@nestjs/common';
import { PrismaService } from '../infrastructure/persistence/prisma.service';
import { ProjectRepositoryImpl } from '../infrastructure/persistence/project.repository.impl';
import { CreateProjectUseCase } from '../application/use-cases/create-project.use-case';

@Module({
  providers: [
    PrismaService,
    CreateProjectUseCase,
    {
      provide: 'IProjectRepository',
      useClass: ProjectRepositoryImpl
    }
  ],
  exports: [CreateProjectUseCase]
})
export class ProjectModule {}
