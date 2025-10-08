import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpException,
  HttpStatus,
  UseInterceptors,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuditInterceptor } from '../../common/interceptors/audit.interceptor';
import { Audit } from '../../common/decorators/audit.decorator';

@Controller('comments')
@UseGuards(JwtAuthGuard)
@UseInterceptors(AuditInterceptor)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @Audit({ action: 'CREATE_COMMENT', resource: 'Comment' })
  async create(@Body() createCommentDto: CreateCommentDto) {
    try {
      return await this.commentsService.create(createCommentDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async findAll() {
    return this.commentsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.commentsService.findOne(id);
  }

  @Patch(':id')
  @Audit({ action: 'UPDATE_COMMENT', resource: 'Comment' })
  async update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentsService.update(id, updateCommentDto);
  }

  @Delete(':id')
  @Audit({ action: 'DELETE_COMMENT', resource: 'Comment' })
  async remove(@Param('id') id: string) {
    return this.commentsService.remove(id);
  }

  @Get(':id/replies')
  async getReplies(@Param('id') id: string) {
    return this.commentsService.getReplies(id);
  }
}
