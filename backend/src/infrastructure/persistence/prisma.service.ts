import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  // Empty database client skeleton
  async onModuleInit() {
    // Database connection initialization hook
  }

  async onModuleDestroy() {
    // Database connection destruction hook
  }
}
