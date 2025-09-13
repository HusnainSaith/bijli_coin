import { Controller, Get, Post, Body, Delete, Param, UseGuards, HttpException, HttpStatus, ParseIntPipe } from '@nestjs/common';
import { FollowersService } from './followers.service';
import { CreateFollowerDto } from './dto/create-follower.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('followers')
@UseGuards(JwtAuthGuard)
export class FollowersController {
  constructor(private readonly followersService: FollowersService) {}

  @Post()
  async create(@Body() createFollowerDto: CreateFollowerDto) {
    try {
      return await this.followersService.create(createFollowerDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('user/:userId')
async findByUser(@Param('userId') userId: string) {
  return this.followersService.findByUser(userId);
}

@Delete(':id')
async remove(@Param('id') id: string) {
  return this.followersService.remove(id);
}
}