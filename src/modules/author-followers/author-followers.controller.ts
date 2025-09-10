import { Controller, Get, Post, Body, Delete, Param, UseGuards, HttpException, HttpStatus, ParseIntPipe } from '@nestjs/common';
import { AuthorFollowersService } from './author-followers.service';
import { CreateAuthorFollowerDto } from './dto/create-author-follower.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('author-followers')
@UseGuards(JwtAuthGuard)
export class AuthorFollowersController {
  constructor(private readonly authorFollowersService: AuthorFollowersService) {}

  @Post()
  async create(@Body() createAuthorFollowerDto: CreateAuthorFollowerDto) {
    try {
      return await this.authorFollowersService.create(createAuthorFollowerDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('followers/:authorId')
  async getFollowers(@Param('authorId', ParseIntPipe) authorId: number) {
    return this.authorFollowersService.getFollowers(authorId);
  }

  @Get('following/:userId')
  async getFollowing(@Param('userId', ParseIntPipe) userId: number) {
    return this.authorFollowersService.getFollowing(userId);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new HttpException('Invalid id parameter', HttpStatus.BAD_REQUEST);
    }
    return this.authorFollowersService.remove(id);
  }
}