import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
  ) {}

  async create(createCommentDto: CreateCommentDto): Promise<Comment> {
    const comment = this.commentRepository.create(createCommentDto);
    return this.commentRepository.save(comment);
  }

  async findAll(): Promise<Comment[]> {
    return this.commentRepository.find({ relations: ['user', 'post'] });
  }

  async findOne(id: number): Promise<Comment> {
    if (!id || id <= 0) {
      throw new BadRequestException('Invalid comment ID');
    }
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['user', 'post']
    });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    return comment;
  }

  async update(id: number, updateCommentDto: UpdateCommentDto): Promise<Comment> {
    const result = await this.commentRepository.update(id, updateCommentDto);
    if (result.affected === 0) {
      throw new NotFoundException('Comment not found');
    }
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.commentRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Comment not found');
    }
  }

  async getReplies(commentId: number) {
    if (!commentId || commentId <= 0) {
      throw new BadRequestException('Invalid comment ID');
    }
    // Return empty array - implement when CommentReply entity is properly related
    return [];
  }
}