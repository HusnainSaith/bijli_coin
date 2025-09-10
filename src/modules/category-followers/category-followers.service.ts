import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryFollower } from './entities/category-follower.entity';
import { CreateCategoryFollowerDto } from './dto/create-category-follower.dto';

@Injectable()
export class CategoryFollowersService {
  constructor(
    @InjectRepository(CategoryFollower)
    private categoryFollowerRepository: Repository<CategoryFollower>,
  ) {}

  async create(createCategoryFollowerDto: CreateCategoryFollowerDto): Promise<CategoryFollower> {
    const categoryFollower = this.categoryFollowerRepository.create(createCategoryFollowerDto);
    return this.categoryFollowerRepository.save(categoryFollower);
  }

  async getFollowers(categoryId: number) {
    if (!categoryId || categoryId <= 0) {
      throw new BadRequestException('Invalid category ID');
    }
    return this.categoryFollowerRepository.find({
      where: { category_id: categoryId },
      relations: ['user']
    });
  }

  async getFollowedCategories(userId: number) {
    if (!userId || userId <= 0) {
      throw new BadRequestException('Invalid user ID');
    }
    return this.categoryFollowerRepository.find({
      where: { user_id: userId },
      relations: ['category']
    });
  }

  async remove(id: number): Promise<void> {
    const result = await this.categoryFollowerRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Category follow relationship not found');
    }
  }
}