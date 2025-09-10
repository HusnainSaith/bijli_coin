import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentReply } from './entities/comment-reply.entity';
import { CreateCommentReplyDto } from './dto/create-comment-reply.dto';
import { UpdateCommentReplyDto } from './dto/update-comment-reply.dto';

@Injectable()
export class CommentRepliesService {
  constructor(
    @InjectRepository(CommentReply)
    private commentReplyRepository: Repository<CommentReply>,
  ) {}

  async create(createCommentReplyDto: CreateCommentReplyDto): Promise<CommentReply> {
    const reply = this.commentReplyRepository.create(createCommentReplyDto);
    return this.commentReplyRepository.save(reply);
  }

  async findOne(id: number): Promise<CommentReply> {
    if (!id || id <= 0) {
      throw new BadRequestException('Invalid comment reply ID');
    }
    const reply = await this.commentReplyRepository.findOne({
      where: { id },
      relations: ['user', 'comment']
    });
    if (!reply) {
      throw new NotFoundException('Comment reply not found');
    }
    return reply;
  }

  async update(id: number, updateCommentReplyDto: UpdateCommentReplyDto): Promise<CommentReply> {
    const result = await this.commentReplyRepository.update(id, updateCommentReplyDto);
    if (result.affected === 0) {
      throw new NotFoundException('Comment reply not found');
    }
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.commentReplyRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Comment reply not found');
    }
  }

  async findByComment(commentId: number): Promise<CommentReply[]> {
    if (!commentId || commentId <= 0) {
      throw new BadRequestException('Invalid comment ID');
    }
    return this.commentReplyRepository.find({
      where: { comment_id: commentId },
      relations: ['user']
    });
  }
}