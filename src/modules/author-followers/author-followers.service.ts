import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthorFollower } from './entities/author-follower.entity';
import { CreateAuthorFollowerDto } from './dto/create-author-follower.dto';

@Injectable()
export class AuthorFollowersService {
  constructor(
    @InjectRepository(AuthorFollower)
    private authorFollowerRepository: Repository<AuthorFollower>,
  ) {}

  async create(
    createAuthorFollowerDto: CreateAuthorFollowerDto,
  ): Promise<AuthorFollower> {
    const authorFollower = this.authorFollowerRepository.create(
      createAuthorFollowerDto,
    );
    return this.authorFollowerRepository.save(authorFollower);
  }

  async getFollowers(authorId: string) {
    if (!authorId || authorId.trim() === '') {
      throw new BadRequestException('Invalid author ID');
    }
    return this.authorFollowerRepository.find({
      where: { author_id: authorId },
      relations: ['follower'],
    });
  }

  async getFollowing(userId: string) {
    if (!userId || userId.trim() === '') {
      throw new BadRequestException('Invalid user ID');
    }
    return this.authorFollowerRepository.find({
      where: { follower_id: userId },
      relations: ['author'],
    });
  }

  async remove(id: string): Promise<void> {
    const result = await this.authorFollowerRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Follow relationship not found');
    }
  }
}
