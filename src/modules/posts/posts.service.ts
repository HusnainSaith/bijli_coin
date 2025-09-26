import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ViewsService } from '../views/views.service';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

async create(createPostDto: CreatePostDto): Promise<Post> {
    try {
      const post = this.postRepository.create({
        ...createPostDto,
        featured_image: createPostDto.featured_image || undefined,
        views_count: 0,
        likes_count: 0,
        comments_count: 0,
      });

      return await this.postRepository.save(post);
    } catch (error) {
      if (error.code === '23505') {
        // Postgres unique constraint violation
        throw new ConflictException(
          error.detail || 'Post with this slug already exists',
        );
      }
      throw error;
    }
  }
  async findAll(filters?: { categoryId?: string; userId?: string }): Promise<Post[]> {
    const query = this.postRepository.createQueryBuilder('post');

    if (filters?.categoryId) {
      query.andWhere('post.category_id = :categoryId', {
        categoryId: filters.categoryId,
      });
    }

    if (filters?.userId) {
      query.andWhere('post.user_id = :userId', { userId: filters.userId });
    }

    return query.getMany();
  }

  async findOne(id: string): Promise<Post> {
    if (!id) {
      throw new BadRequestException('Invalid post ID');
    }

    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['user', 'category'],
    });

    if (!post) {
      throw new NotFoundException(`Post not found with id: ${id}`);
    }

    return post;
  }

  async incrementViews(id: string): Promise<void> {
    await this.postRepository.increment({ id }, 'views_count', 1);
  }

  async incrementLikes(id: string): Promise<void> {
    await this.postRepository.increment({ id }, 'likes_count', 1);
  }

  async decrementLikes(id: string): Promise<void> {
    await this.postRepository.decrement({ id }, 'likes_count', 1);
  }

  async incrementComments(id: string): Promise<void> {
    await this.postRepository.increment({ id }, 'comments_count', 1);
  }

  async decrementComments(id: string): Promise<void> {
    await this.postRepository.decrement({ id }, 'comments_count', 1);
  }

  async update(id: string, updatePostDto: UpdatePostDto): Promise<Post> {
    const result = await this.postRepository.update(id, updatePostDto);
    if (result.affected === 0) {
      throw new NotFoundException(`Post not found with id: ${id}`);
    }
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const result = await this.postRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Post not found with id: ${id}`);
    }
  }

async getComments(postId: string) {
  if (!postId) {
    throw new BadRequestException('Invalid post ID');
  }

  const post = await this.postRepository.findOne({
    where: { id: postId },
    relations: ['comments'],
  });

  if (!post) {
    throw new NotFoundException(`Post not found with id: ${postId}`);
  }

  return post.comments;
}

async getMedia(postId: string) {
  if (!postId) {
    throw new BadRequestException('Invalid post ID');
  }

  const post = await this.postRepository.findOne({
    where: { id: postId },
    relations: ['media'],
  });

  if (!post) {
    throw new NotFoundException(`Post not found with id: ${postId}`);
  }

  return post.media;
}

async getTags(postId: string) {
  if (!postId) {
    throw new BadRequestException('Invalid post ID');
  }

  const post = await this.postRepository.findOne({
    where: { id: postId },
    relations: ['tags'],
  });

  if (!post) {
    throw new NotFoundException(`Post not found with id: ${postId}`);
  }

  return post.tags;
}

async getReactions(postId: string) {
  if (!postId) {
    throw new BadRequestException('Invalid post ID');
  }

  const post = await this.postRepository.findOne({
    where: { id: postId },
    relations: ['reactions'],
  });

  if (!post) {
    throw new NotFoundException(`Post not found with id: ${postId}`);
  }

  return post.reactions;
}}
