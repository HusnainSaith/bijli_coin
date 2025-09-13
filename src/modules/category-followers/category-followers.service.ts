import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryFollower } from './entities/category-follower.entity';
import { CreateCategoryFollowerDto } from './dto/create-category-follower.dto';
import { Post } from '../posts/entities/post.entity';

@Injectable()
export class CategoryFollowersService {
  constructor(
    @InjectRepository(CategoryFollower)
    private categoryFollowerRepository: Repository<CategoryFollower>,

     @InjectRepository(Post)   // <-- This is missing in the module
  private postRepository: Repository<Post>,
  ) {}

  async create(createCategoryFollowerDto: CreateCategoryFollowerDto): Promise<CategoryFollower> {
    const categoryFollower = this.categoryFollowerRepository.create(createCategoryFollowerDto);
    return this.categoryFollowerRepository.save(categoryFollower);
  }

  async getFollowers(categoryId: string) {  // ✅ string instead of number
  if (!categoryId) {
    throw new BadRequestException('Invalid category ID');
  }
  return this.categoryFollowerRepository.find({
    where: { category_id: categoryId },   // ✅ camelCase property from entity
    relations: ['user'],
  });
}

async getUserFollowedCategories(userId: string) {
  if (!userId) {
    throw new BadRequestException('Invalid user ID');
  }
  return this.categoryFollowerRepository.find({
    where: { user_id: userId },       
    relations: ['category'],
  });
}

  async remove(id: string): Promise<{ success: boolean; message: string }> {
  const result = await this.categoryFollowerRepository.delete(id);

  if (result.affected === 0) {
    return {
      success: false,
      message: 'Category follow relationship not found',
    };
  }

  return {
    success: true,
    message: 'Category follow relationship removed successfully',
  };
}

}