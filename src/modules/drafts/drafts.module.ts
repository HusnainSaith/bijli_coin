import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DraftsService } from './drafts.service';
import { DraftsController } from './drafts.controller';
import { Draft } from './entities/draft.entity';
import { AuditLogsModule } from '../audit-logs/audit-logs.module';

@Module({
  imports: [TypeOrmModule.forFeature([Draft]), AuditLogsModule],
  controllers: [DraftsController],
  providers: [DraftsService],
})
export class DraftsModule {}