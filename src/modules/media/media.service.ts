import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Media } from './entities/media.entity';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media)
    private mediaRepository: Repository<Media>,
  ) {}

  async create(createMediaDto: CreateMediaDto): Promise<Media> {
    const media = this.mediaRepository.create(createMediaDto);
    return this.mediaRepository.save(media);
  }

  async findAll(): Promise<Media[]> {
    return this.mediaRepository.find({ relations: ['user'] });
  }

  async findOne(id: number): Promise<Media> {
    if (!id || id <= 0) {
      throw new BadRequestException('Invalid media ID');
    }
    const media = await this.mediaRepository.findOne({
      where: { id },
      relations: ['user']
    });
    if (!media) {
      throw new NotFoundException('Media not found');
    }
    return media;
  }

  async update(id: number, updateMediaDto: UpdateMediaDto): Promise<Media> {
    const result = await this.mediaRepository.update(id, updateMediaDto);
    if (result.affected === 0) {
      throw new NotFoundException('Media not found');
    }
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.mediaRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Media not found');
    }
  }

  async findByUser(userId: number): Promise<Media[]> {
    if (!userId || userId <= 0) {
      throw new BadRequestException('Invalid user ID');
    }
    return this.mediaRepository.find({
      where: { user_id: userId },
      relations: ['user']
    });
  }
}