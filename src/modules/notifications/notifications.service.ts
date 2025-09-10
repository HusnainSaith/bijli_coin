import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}

  async create(createNotificationDto: CreateNotificationDto): Promise<Notification> {
    const notification = this.notificationRepository.create(createNotificationDto);
    return this.notificationRepository.save(notification);
  }

  async findByUser(userId: number): Promise<Notification[]> {
    if (!userId || userId <= 0) {
      throw new BadRequestException('Invalid user ID');
    }
    return this.notificationRepository.find({
      where: { user_id: userId },
      order: { created_at: 'DESC' }
    });
  }

  async markAsRead(id: number): Promise<Notification> {
    const result = await this.notificationRepository.update(id, { is_read: true });
    if (result.affected === 0) {
      throw new NotFoundException('Notification not found');
    }
    const notification = await this.notificationRepository.findOne({ where: { id } });
    if (!notification) {
      throw new NotFoundException('Notification not found');
    }
    return notification;
  }

  async remove(id: number): Promise<void> {
    const result = await this.notificationRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Notification not found');
    }
  }
}