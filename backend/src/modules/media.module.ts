import { Module } from '@nestjs/common';
import { PrismaService } from '../infrastructure/persistence/prisma.service';
import { R2StorageImpl } from '../infrastructure/storage/r2.storage.impl';

@Module({
  providers: [
    PrismaService,
    {
      provide: 'IMediaStorage',
      useClass: R2StorageImpl
    }
  ],
  exports: ['IMediaStorage']
})
export class MediaModule {}
