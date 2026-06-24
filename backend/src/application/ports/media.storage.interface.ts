export interface IMediaStorage {
  uploadFile(file: any, path: string): Promise<string>;
  deleteFile(path: string): Promise<boolean>;
  getPresignedUrl(path: string, expirySeconds: number): Promise<string>;
}
