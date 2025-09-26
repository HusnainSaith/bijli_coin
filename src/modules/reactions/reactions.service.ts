import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reaction } from './entities/reaction.entity';
import { CreateReactionDto } from './dto/create-reaction.dto';
import { Post } from '../posts/entities/post.entity';

@Injectable()
export class ReactionsService {
  constructor(
    @InjectRepository(Reaction)
    private reactionRepository: Repository<Reaction>,
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  async create(createReactionDto: CreateReactionDto): Promise<Reaction> {
    const reaction = this.reactionRepository.create(createReactionDto);
    const savedReaction = await this.reactionRepository.save(reaction);
    
    if (createReactionDto.reactable_type === 'post') {
      await this.postRepository.increment(
        { id: createReactionDto.reactable_id }, 
        'likes_count', 
        1
      );
    }
    
    return savedReaction;
  }

  async findByPost(postId: string): Promise<Reaction[]> {
    if (!postId ) {
      throw new BadRequestException('Invalid post ID');
    }
    return this.reactionRepository.find({
      where: { reactable_id: postId, reactable_type: 'post' },
      relations: ['user']
    });
  }

  async remove(id: string): Promise<void> {
    if (!id) {
      throw new BadRequestException('Invalid reaction ID');
    }
    
    const reaction = await this.reactionRepository.findOne({ where: { id } });
    if (!reaction) {
      throw new NotFoundException('Reaction not found');
    }
    
    const result = await this.reactionRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Reaction not found');
    }
    
    if (reaction.reactable_type === 'post') {
      await this.postRepository.decrement(
        { id: reaction.reactable_id }, 
        'likes_count', 
        1
      );
    }
  }
}