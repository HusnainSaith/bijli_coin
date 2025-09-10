import { Controller, Get, Post, Body, Delete, Param, UseGuards, HttpException, HttpStatus, ParseIntPipe } from '@nestjs/common';
import { CategoryFollowersService } from './category-followers.service';
import { CreateCategoryFollowerDto } from './dto/create-category-follower.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('category-followers')
@UseGuards(JwtAuthGuard)
export class CategoryFollowersController {
  constructor(private readonly categoryFollowersService: CategoryFollowersService) {}

  @Post()
  async create(@Body() createCategoryFollowerDto: CreateCategoryFollowerDto) {
    try {
      return await this.categoryFollowersService.create(createCategoryFollowerDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('category/:categoryId')
  async getFollowers(@Param('categoryId', ParseIntPipe) categoryId: number) {
    return this.categoryFollowersService.getFollowers(categoryId);
  }

  @Get('user/:userId')
  async getFollowedCategories(@Param('userId', ParseIntPipe) userId: number) {
    return this.categoryFollowersService.getFollowedCategories(userId);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.categoryFollowersService.remove(id);
  }
}