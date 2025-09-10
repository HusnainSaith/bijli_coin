import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpException, HttpStatus, ParseIntPipe, ParseUUIDPipe } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('categories')
@UseGuards(JwtAuthGuard)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    try {
      return await this.categoriesService.create(createCategoryDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async findAll() {
    return this.categoriesService.findAll();
  }

@Get(':id')
async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
  return this.categoriesService.findOne(id);
}

@Patch(':id')
async update(
  @Param('id', new ParseUUIDPipe()) id: string,
  @Body() updateCategoryDto: UpdateCategoryDto,
) {
  return this.categoriesService.update(id, updateCategoryDto);
}

@Delete(':id')
async remove(@Param('id', new ParseUUIDPipe()) id: string) {
  return this.categoriesService.remove(id);
}

  @Get(':id/posts')
  async getPosts(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.categoriesService.getPosts(id);
  }

  @Get(':id/followers')
  async getFollowers(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.categoriesService.getFollowers(id);
  }
}