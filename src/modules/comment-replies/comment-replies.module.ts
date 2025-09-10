import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentRepliesService } from './comment-replies.service';
import { CommentRepliesController } from './comment-replies.controller';
import { CommentReply } from './entities/comment-reply.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CommentReply])],
  controllers: [CommentRepliesController],
  providers: [CommentRepliesService],
})
export class CommentRepliesModule {}