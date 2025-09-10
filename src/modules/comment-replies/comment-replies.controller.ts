import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpException, HttpStatus, ParseIntPipe } from '@nestjs/common';
import { CommentRepliesService } from './comment-replies.service';
import { CreateCommentReplyDto } from './dto/create-comment-reply.dto';
import { UpdateCommentReplyDto } from './dto/update-comment-reply.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('comment-replies')
@UseGuards(JwtAuthGuard)
export class CommentRepliesController {
  constructor(private readonly commentRepliesService: CommentRepliesService) {}

  @Post()
  async create(@Body() createCommentReplyDto: CreateCommentReplyDto) {
    try {
      return await this.commentRepliesService.create(createCommentReplyDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.commentRepliesService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateCommentReplyDto: UpdateCommentReplyDto) {
    return this.commentRepliesService.update(id, updateCommentReplyDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.commentRepliesService.remove(id);
  }

  @Get('comment/:commentId')
  async findByComment(@Param('commentId', ParseIntPipe) commentId: number) {
    return this.commentRepliesService.findByComment(commentId);
  }
}