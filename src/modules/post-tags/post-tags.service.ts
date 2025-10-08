import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostTag } from './entities/post-tag.entity';
import { CreatePostTagDto } from './dto/create-post-tag.dto';

@Injectable()
export class PostTagsService {
  constructor(
    @InjectRepository(PostTag)
    private postTagRepository: Repository<PostTag>,
  ) {}

  async create(createPostTagDto: CreatePostTagDto): Promise<PostTag> {
    const postTag = this.postTagRepository.create(createPostTagDto);
    return this.postTagRepository.save(postTag);
  }

  async findByPost(postId: string): Promise<PostTag[]> {
    if (!postId) {
      throw new BadRequestException('Invalid post ID');
    }
    return this.postTagRepository.find({
      where: { post_id: postId },
      relations: ['tag'],
    });
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.postTagRepository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
