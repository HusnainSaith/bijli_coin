import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, HttpStatus, HttpException, UseInterceptors, UploadedFile } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuditInterceptor } from '../../common/interceptors/audit.interceptor';
import { Audit } from '../../common/decorators/audit.decorator';

@Controller('posts')
@UseGuards(JwtAuthGuard)
@UseInterceptors(AuditInterceptor)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

 @Post()
  @Audit({ action: 'CREATE_POST', resource: 'Post' })
  async create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }

  @Get()
  async findAll(@Query('category') categoryId?: string, @Query('user') userId?: string) {
    return this.postsService.findAll({ categoryId, userId });
  }

  @Get(':id')
  @Audit({ action: 'VIEW_POST', resource: 'Post' })
  async findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @Patch(':id')
  @Audit({ action: 'UPDATE_POST', resource: 'Post' })
  async update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(id, updatePostDto);
  }

  @Delete(':id')
  @Audit({ action: 'DELETE_POST', resource: 'Post' })
  async remove(@Param('id') id: string) {
    return this.postsService.remove(id);
  }

  @Get(':id/comments')
  async getComments(@Param('id') id: string) {
    return this.postsService.getComments(id);
  }

  @Get(':id/media')
  async getMedia(@Param('id') id: string) {
    return this.postsService.getMedia(id);
  }

  @Get(':id/tags')
  async getTags(@Param('id') id: string) {
    return this.postsService.getTags(id);
  }

  @Get(':id/reactions')
  async getReactions(@Param('id') id: string) {
    return this.postsService.getReactions(id);
  }
}