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
import { CategoryFollowersService } from './category-followers.service';
import { CreateCategoryFollowerDto } from './dto/create-category-follower.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('category-followers')
@UseGuards(JwtAuthGuard)
export class CategoryFollowersController {
  constructor(
    private readonly categoryFollowersService: CategoryFollowersService,
  ) {}

  @Post()
  async create(@Body() createCategoryFollowerDto: CreateCategoryFollowerDto) {
    try {
      return await this.categoryFollowersService.create(
        createCategoryFollowerDto,
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('category/:categoryId')
  async getFollowers(@Param('categoryId') categoryId: string) {
    return this.categoryFollowersService.getFollowers(categoryId);
  }

  @Get('user/:userId')
  async getFollowedCategories(@Param('userId') userId: string) {
    return this.categoryFollowersService.getUserFollowedCategories(userId);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.categoryFollowersService.remove(id);
  }
}
