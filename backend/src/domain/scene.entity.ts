export class SceneEntity {
  id: string;
  projectId: string;
  orderIndex: number;
  title: string;
  durationMs: number;
  layers: any[];
  transitions: any;
  settings: any;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Partial<SceneEntity>) {
    Object.assign(this, data);
  }
}
