export class ProjectEntity {
  id: string;
  workspaceId: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  constructor(data: Partial<ProjectEntity>) {
    Object.assign(this, data);
  }
}
