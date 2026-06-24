export interface Project {
  id: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  sceneCount: number;
  durationMs: number;
  createdAt: string;
  updatedAt: string;
}
