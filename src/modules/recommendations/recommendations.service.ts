import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Recommendation } from './entities/recommendation.entity';
import { CreateRecommendationDto } from './dto/create-recommendation.dto';
import { UpdateRecommendationDto } from './dto/update-recommendation.dto';

@Injectable()
export class RecommendationsService {
  constructor(
    @InjectRepository(Recommendation)
    private recommendationRepository: Repository<Recommendation>,
  ) {}

  async create(createRecommendationDto: CreateRecommendationDto): Promise<Recommendation> {
    const recommendation = this.recommendationRepository.create(createRecommendationDto);
    return this.recommendationRepository.save(recommendation);
  }

  async findByUser(userId: number): Promise<Recommendation[]> {
    if (!userId || userId <= 0) {
      throw new BadRequestException('Invalid user ID');
    }
    return this.recommendationRepository.find({
      where: { user_id: userId },
      relations: ['user']
    });
  }

  async update(id: number, updateRecommendationDto: UpdateRecommendationDto): Promise<Recommendation> {
    const result = await this.recommendationRepository.update(id, updateRecommendationDto);
    if (result.affected === 0) {
      throw new NotFoundException('Recommendation not found');
    }
    const recommendation = await this.recommendationRepository.findOne({ where: { id } });
    if (!recommendation) {
      throw new NotFoundException('Recommendation not found');
    }
    return recommendation;
  }

  async remove(id: number): Promise<void> {
    const result = await this.recommendationRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Recommendation not found');
    }
  }
}