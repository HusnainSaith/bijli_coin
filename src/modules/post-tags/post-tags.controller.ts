import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { PostTagsService } from './post-tags.service';
import { CreatePostTagDto } from './dto/create-post-tag.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('post-tags')
@UseGuards(JwtAuthGuard)
export class PostTagsController {
  constructor(private readonly postTagsService: PostTagsService) {}

  @Post()
  async create(@Body() createPostTagDto: CreatePostTagDto) {
    try {
      return await this.postTagsService.create(createPostTagDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('post/:postId')
  async findByPost(@Param('postId') postId: string) {
    return this.postTagsService.findByPost(postId);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.postTagsService.remove(id);
  }
}
