import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  UseInterceptors,
  Req,
  UploadedFile,
} from '@nestjs/common';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ViewsService } from '../views/views.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuditInterceptor } from '../../common/interceptors/audit.interceptor';
import { Audit } from '../../common/decorators/audit.decorator';

@Controller('posts')
@UseGuards(JwtAuthGuard)
@UseInterceptors(AuditInterceptor)
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly viewsService: ViewsService,
  ) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('featured_image', {
      storage: diskStorage({
        destination: './uploads/post-images',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
          return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
    }),
  )
  @Audit({ action: 'CREATE_POST', resource: 'Post' })
  async create(
    @Body() createPostDto: CreatePostDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.postsService.create(createPostDto, file?.filename);
  }

  @Get()
  async findAll(
    @Query('category') categoryId?: string,
    @Query('user') userId?: string,
  ) {
    return this.postsService.findAll({ categoryId, userId });
  }

  @Get(':id')
  @Audit({ action: 'VIEW_POST', resource: 'Post' })
  async findOne(
    @Param('id') id: string,
    @Req() req: Request & { user?: { id: string } },
  ) {
    const post = await this.postsService.findOne(id);
    await this.postsService.incrementViews(id);

    // Create view record
    await this.viewsService.create({
      user_id: req.user?.id,
      viewable_type: 'post',
      viewable_id: id,
      ip_address: req.ip || req.socket?.remoteAddress || 'unknown',
    });

    return post;
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
