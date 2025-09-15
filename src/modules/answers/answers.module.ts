import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnswersService } from './answers.service';
import { AnswersController } from './answers.controller';
import { Answer } from './entities/answer.entity';
import { AuditLogsModule } from '../audit-logs/audit-logs.module';

@Module({
  imports: [TypeOrmModule.forFeature([Answer]), AuditLogsModule],
  controllers: [AnswersController],
  providers: [AnswersService],
})
export class AnswersModule {}