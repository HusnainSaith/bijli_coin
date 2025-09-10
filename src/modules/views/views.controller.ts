import { Controller, Get, Post, Body, Param, UseGuards, HttpException, HttpStatus, ParseIntPipe } from '@nestjs/common';
import { ViewsService } from './views.service';
import { CreateViewDto } from './dto/create-view.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('views')
@UseGuards(JwtAuthGuard)
export class ViewsController {
  constructor(private readonly viewsService: ViewsService) {}

  @Post()
  async create(@Body() createViewDto: CreateViewDto) {
    try {
      return await this.viewsService.create(createViewDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('user/:userId')
  async findByUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.viewsService.findByUser(userId);
  }

  @Get('post/:postId')
  async findByPost(@Param('postId', ParseIntPipe) postId: number) {
    return this.viewsService.findByPost(postId);
  }
}