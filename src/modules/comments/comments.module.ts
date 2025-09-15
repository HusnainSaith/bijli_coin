import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { Comment } from './entities/comment.entity';
import { CommentReply } from '../comment-replies/entities/comment-reply.entity';
import { AuditLogsModule } from '../audit-logs/audit-logs.module';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, CommentReply]), AuditLogsModule],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}