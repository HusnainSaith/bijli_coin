import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ViewsService } from './views.service';
import { CreateViewDto } from './dto/create-view.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('views')
@UseGuards(JwtAuthGuard)
export class ViewsController {
  constructor(private readonly viewsService: ViewsService) {}

  @Get('user/:userId')
  async findByUser(@Param('userId') userId: string) {
    return this.viewsService.findByUser(userId);
  }

  @Get('post/:postId')
  async findByPost(@Param('postId') postId: string) {
    return this.viewsService.findByPost(postId);
  }
}
