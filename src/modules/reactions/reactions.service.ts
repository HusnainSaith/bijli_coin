import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reaction } from './entities/reaction.entity';
import { CreateReactionDto } from './dto/create-reaction.dto';

@Injectable()
export class ReactionsService {
  constructor(
    @InjectRepository(Reaction)
    private reactionRepository: Repository<Reaction>,
  ) {}

  async create(createReactionDto: CreateReactionDto): Promise<Reaction> {
    const reaction = this.reactionRepository.create(createReactionDto);
    return this.reactionRepository.save(reaction);
  }

  async findByPost(postId: number): Promise<Reaction[]> {
    if (!postId || postId <= 0) {
      throw new BadRequestException('Invalid post ID');
    }
    return this.reactionRepository.find({
      where: { reactable_id: postId, reactable_type: 'post' },
      relations: ['user']
    });
  }

  async remove(id: number): Promise<void> {
    const result = await this.reactionRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Reaction not found');
    }
  }
}