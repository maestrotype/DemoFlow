export interface Project {
  id: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  status: 'draft' | 'in-progress' | 'completed' | 'archived';
  thumbnail?: {
    url: string;
    alt: string;
  };
  sceneCount: number;
  durationMs: number;
  createdAt: string;
  updatedAt: string;
  lastEdited?: string;
}
