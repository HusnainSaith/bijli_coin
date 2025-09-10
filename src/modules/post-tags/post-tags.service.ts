import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
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

  async findByPost(postId: number): Promise<PostTag[]> {
    if (!postId || postId <= 0) {
      throw new BadRequestException('Invalid post ID');
    }
    return this.postTagRepository.find({
      where: { post_id: postId },
      relations: ['tag']
    });
  }

  async remove(id: number): Promise<void> {
    const result = await this.postTagRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Post tag relationship not found');
    }
  }
}