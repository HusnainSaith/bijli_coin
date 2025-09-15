import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpException, HttpStatus, UseInterceptors } from '@nestjs/common';
import { CommentRepliesService } from './comment-replies.service';
import { CreateCommentReplyDto } from './dto/create-comment-reply.dto';
import { UpdateCommentReplyDto } from './dto/update-comment-reply.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuditInterceptor } from '../../common/interceptors/audit.interceptor';
import { Audit } from '../../common/decorators/audit.decorator';

@Controller('comment-replies')
@UseGuards(JwtAuthGuard)
@UseInterceptors(AuditInterceptor)
export class CommentRepliesController {
  constructor(private readonly commentRepliesService: CommentRepliesService) {}

  @Post()
  @Audit({ action: 'CREATE_REPLY', resource: 'CommentReply' })
  async create(@Body() createCommentReplyDto: CreateCommentReplyDto) {
    try {
      return await this.commentRepliesService.create(createCommentReplyDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.commentRepliesService.findOne(id);
  }

  @Patch(':id')
  @Audit({ action: 'UPDATE_REPLY', resource: 'CommentReply' })
  async update(@Param('id') id: string, @Body() updateCommentReplyDto: UpdateCommentReplyDto) {
    return this.commentRepliesService.update(id, updateCommentReplyDto);
  }

  @Delete(':id')
  @Audit({ action: 'DELETE_REPLY', resource: 'CommentReply' })
  async remove(@Param('id') id: string) {
    return this.commentRepliesService.remove(id);
  }

  @Get('comment/:commentId')
  async findByComment(@Param('commentId') commentId: string) {
    return this.commentRepliesService.findByComment(commentId);
  }
}