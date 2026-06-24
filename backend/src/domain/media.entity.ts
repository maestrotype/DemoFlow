export class MediaEntity {
  id: string;
  workspaceId: string;
  filename: string;
  originalName: string;
  type: string;
  url: string;
  thumbnailUrl?: string;
  fileSizeBytes: number;
  createdAt: Date;

  constructor(data: Partial<MediaEntity>) {
    Object.assign(this, data);
  }
}
