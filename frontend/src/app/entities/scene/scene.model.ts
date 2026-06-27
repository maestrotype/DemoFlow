export interface Scene {
  id: string;
  projectId: string;
  orderIndex: number;
  title: string;
  durationMs: number;
  layers: any[];
  transitions: any;
  settings: any;
  createdAt: string;
  updatedAt: string;
}
