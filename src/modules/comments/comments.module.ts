import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { Comment } from './entities/comment.entity';
import { CommentReply } from '../comment-replies/entities/comment-reply.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, CommentReply])],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}