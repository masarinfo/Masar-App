import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { WorkspaceModule } from './modules/workspace/workspace.module';
import { SyncModule } from './modules/sync/sync.module';
import { PageModule } from './modules/page/page.module';
import { DatabaseModule } from './modules/database/database.module';
import { AiModule } from './modules/ai/ai.module';
import { AuditLogModule } from './modules/audit-log/audit-log.module';

@Module({
  imports: [
    AuthModule,
    WorkspaceModule,
    SyncModule,
    PageModule,
    DatabaseModule,
    AiModule,
    AuditLogModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
