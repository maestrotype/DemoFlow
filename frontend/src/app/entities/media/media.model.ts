export interface MediaAsset {
  id: string;
  filename: string;
  originalName: string;
  type: 'SCREENSHOT' | 'RECORDING' | 'IMAGE' | 'VIDEO' | 'GIF';
  url: string;
  thumbnailUrl?: string;
  fileSizeBytes: number;
  durationMs?: number;
  width?: number;
  height?: number;
  createdAt: string;
}
