import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tracking } from './entities/tracking.entity';
import { CreateTrackingDto } from './dto/create-tracking.dto';

@Injectable()
export class TrackingService {
  constructor(
    @InjectRepository(Tracking)
    private trackingRepository: Repository<Tracking>,
  ) {}

  async create(createTrackingDto: CreateTrackingDto): Promise<Tracking> {
    const tracking = this.trackingRepository.create(createTrackingDto);
    return this.trackingRepository.save(tracking);
  }

  async findByUser(userId: number): Promise<Tracking[]> {
    if (!userId || userId <= 0) {
      throw new BadRequestException('Invalid user ID');
    }
    return this.trackingRepository.find({
      where: { user_id: userId },
      relations: ['user']
    });
  }
}