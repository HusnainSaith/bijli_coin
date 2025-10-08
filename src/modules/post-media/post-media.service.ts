import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostMedia } from './entities/post-media.entity';
import { CreatePostMediaDto } from './dto/create-post-media.dto';

@Injectable()
export class PostMediaService {
  constructor(
    @InjectRepository(PostMedia)
    private postMediaRepository: Repository<PostMedia>,
  ) {}

  async create(createPostMediaDto: CreatePostMediaDto): Promise<PostMedia> {
    const postMedia = this.postMediaRepository.create(createPostMediaDto);
    return this.postMediaRepository.save(postMedia);
  }

  async findByPost(postId: string): Promise<PostMedia[]> {
    if (!postId) {
      throw new BadRequestException('Invalid post ID');
    }
    return this.postMediaRepository.find({
      where: { post_id: postId },
      relations: ['media'],
    });
  }

  async remove(id: string): Promise<void> {
    const result = await this.postMediaRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Post media relationship not found');
    }
  }
}
