import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Follower } from './entities/follower.entity';
import { CreateFollowerDto } from './dto/create-follower.dto';

@Injectable()
export class FollowersService {
  constructor(
    @InjectRepository(Follower)
    private followerRepository: Repository<Follower>,
  ) {}

  async create(createFollowerDto: CreateFollowerDto): Promise<Follower> {
    const follower = this.followerRepository.create(createFollowerDto);
    return this.followerRepository.save(follower);
  }

  async findByUser(userId: string): Promise<Follower[]> {
    if (!userId) {
      throw new BadRequestException('Invalid user ID');
    }
    return this.followerRepository.find({
      where: { follower_id: userId }, // UUID string
      relations: ['follower', 'following'],
    });
  }

  async remove(id: string): Promise<void> {
    const result = await this.followerRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Follower relationship not found');
    }
  }
}
