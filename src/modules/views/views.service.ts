import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { View } from './entities/view.entity';
import { CreateViewDto } from './dto/create-view.dto';

@Injectable()
export class ViewsService {
  constructor(
    @InjectRepository(View)
    private viewRepository: Repository<View>,
  ) {}

  async create(createViewDto: CreateViewDto): Promise<View> {
    const view = this.viewRepository.create(createViewDto);
    return this.viewRepository.save(view);
  }

  async findByUser(userId: number): Promise<View[]> {
    if (!userId || userId <= 0) {
      throw new BadRequestException('Invalid user ID');
    }
    return this.viewRepository.find({
      where: { user_id: userId },
      relations: ['user', 'post']
    });
  }

  async findByPost(postId: number): Promise<View[]> {
    if (!postId || postId <= 0) {
      throw new BadRequestException('Invalid post ID');
    }
    return this.viewRepository.find({
      where: { viewable_id: postId, viewable_type: 'post' },
      relations: ['user']
    });
  }
}