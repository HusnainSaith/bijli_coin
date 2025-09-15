import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bookmark } from './entities/bookmark.entity';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';

@Injectable()
export class BookmarksService {
  constructor(
    @InjectRepository(Bookmark)
    private bookmarkRepository: Repository<Bookmark>,
  ) {}

  async create(createBookmarkDto: CreateBookmarkDto): Promise<Bookmark> {
    const bookmark = this.bookmarkRepository.create(createBookmarkDto);
    return this.bookmarkRepository.save(bookmark);
  }

  async findByUser(userId: string): Promise<Bookmark[]> {
    if (!userId) {
      throw new BadRequestException('Invalid user ID');
    }
    return this.bookmarkRepository.find({
      where: { user_id: userId },
      relations: ['post']
    });
  }

  async remove(id: string): Promise<void> {
    const result = await this.bookmarkRepository.delete(id);
    if (result.affected) {
      throw new NotFoundException('Bookmark not found');
    }
  }
}