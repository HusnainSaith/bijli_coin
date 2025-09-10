import { Controller, Get, Post, Body, Delete, Param, UseGuards, HttpException, HttpStatus, ParseIntPipe } from '@nestjs/common';
import { ReactionsService } from './reactions.service';
import { CreateReactionDto } from './dto/create-reaction.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('reactions')
@UseGuards(JwtAuthGuard)
export class ReactionsController {
  constructor(private readonly reactionsService: ReactionsService) {}

  @Post()
  async create(@Body() createReactionDto: CreateReactionDto) {
    try {
      return await this.reactionsService.create(createReactionDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('post/:postId')
  async findByPost(@Param('postId', ParseIntPipe) postId: number) {
    return this.reactionsService.findByPost(postId);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.reactionsService.remove(id);
  }
}