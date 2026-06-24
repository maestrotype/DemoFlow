import { Injectable } from '@nestjs/common';
import { IMediaStorage } from '../../application/ports/media.storage.interface';

@Injectable()
export class R2StorageImpl implements IMediaStorage {
  async uploadFile(file: any, path: string): Promise<string> {
    return `https://cdn.demoflow.io/${path}`;
  }

  async deleteFile(path: string): Promise<boolean> {
    return true;
  }

  async getPresignedUrl(path: string, expirySeconds: number): Promise<string> {
    return `https://cdn.demoflow.io/${path}?token=expired-after-${expirySeconds}`;
  }
}
