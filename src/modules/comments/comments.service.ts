import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentReply } from '../comment-replies/entities/comment-reply.entity';
import { Post } from '../posts/entities/post.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,

    @InjectRepository(CommentReply)
    private commentReplyRepository: Repository<CommentReply>,

    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  async create(createCommentDto: CreateCommentDto): Promise<Comment> {
    const comment = this.commentRepository.create(createCommentDto);
    const savedComment = await this.commentRepository.save(comment);

    await this.postRepository.increment(
      { id: createCommentDto.post_id },
      'comments_count',
      1,
    );

    return savedComment;
  }

  async findAll(): Promise<Comment[]> {
    return this.commentRepository.find({ relations: ['user', 'post'] });
  }

  async findOne(id: string): Promise<Comment> {
    if (!id) {
      throw new BadRequestException('Invalid comment ID');
    }
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['user', 'post'],
    });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    return comment;
  }

  async update(
    id: string,
    updateCommentDto: UpdateCommentDto,
  ): Promise<Comment> {
    const result = await this.commentRepository.update(id, updateCommentDto);
    if (result.affected === 0) {
      throw new NotFoundException('Comment not found');
    }
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const comment = await this.commentRepository.findOne({ where: { id } });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    const result = await this.commentRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Comment not found');
    }

    await this.postRepository.decrement(
      { id: comment.post_id },
      'comments_count',
      1,
    );
  }

  async getReplies(commentId: string) {
    if (!commentId) {
      throw new BadRequestException('Invalid comment ID');
    }

    const replies = await this.commentReplyRepository.find({
      where: { comment_id: commentId },
      relations: ['user'], // include user info
      order: { created_at: 'ASC' },
    });

    if (!replies || replies.length === 0) {
      throw new NotFoundException('No replies found for this comment');
    }

    return replies;
  }
}
