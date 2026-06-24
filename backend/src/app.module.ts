import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProjectModule } from './modules/project.module';
import { MediaModule } from './modules/media.module';
import { AiModule } from './modules/ai.module';
import { ExportModule } from './modules/export.module';
import { AuthModule } from './modules/auth.module';

@Module({
  imports: [
    ProjectModule,
    MediaModule,
    AiModule,
    ExportModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
