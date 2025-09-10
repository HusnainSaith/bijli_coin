import { Controller, Get, Post, Body, Delete, Param, UseGuards, HttpException, HttpStatus, ParseIntPipe } from '@nestjs/common';
import { PostMediaService } from './post-media.service';
import { CreatePostMediaDto } from './dto/create-post-media.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('post-media')
@UseGuards(JwtAuthGuard)
export class PostMediaController {
  constructor(private readonly postMediaService: PostMediaService) {}

  @Post()
  async create(@Body() createPostMediaDto: CreatePostMediaDto) {
    try {
      return await this.postMediaService.create(createPostMediaDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('post/:postId')
  async findByPost(@Param('postId', ParseIntPipe) postId: number) {
    return this.postMediaService.findByPost(postId);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.postMediaService.remove(id);
  }
}