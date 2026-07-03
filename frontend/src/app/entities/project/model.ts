export interface Project {
  id: string;
  title: string;
  description: string;
  status: 'draft' | 'in-progress' | 'completed' | 'archived';
  thumbnail?: {
    url: string;
    alt: string;
  };
  lastEdited: Date;
  durationMs?: number; // in milliseconds
  sceneCount?: number;
  mediaCount?: number;
  collaborators?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Statistics {
  totalProjects: number;
  videos: number;
  exports: number;
  storageUsed: string;
}
