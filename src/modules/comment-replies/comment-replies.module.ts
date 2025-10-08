import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentRepliesService } from './comment-replies.service';
import { CommentRepliesController } from './comment-replies.controller';
import { CommentReply } from './entities/comment-reply.entity';
import { AuditLogsModule } from '../audit-logs/audit-logs.module';

@Module({
  imports: [TypeOrmModule.forFeature([CommentReply]), AuditLogsModule],
  controllers: [CommentRepliesController],
  providers: [CommentRepliesService],
})
export class CommentRepliesModule {}
