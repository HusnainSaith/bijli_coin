import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
// import { UpdateNotificationDto } from './dto/update-notification.dto';
import * as nodemailer from 'nodemailer';

@Injectable()
export class NotificationsService {
  private transporter;

  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER || 'your-email@gmail.com',
        pass: process.env.EMAIL_PASS || 'your-app-password',
      },
    });
  }

  async create(
    createNotificationDto: CreateNotificationDto,
  ): Promise<Notification> {
    const notification = this.notificationRepository.create({
      userId: createNotificationDto.user_id,
      type: createNotificationDto.type,
      title: createNotificationDto.title,
      message: createNotificationDto.message,
      isRead: createNotificationDto.is_read ?? false,
    });

    const savedNotification =
      await this.notificationRepository.save(notification);

    await this.sendEmailNotification(createNotificationDto);
    return savedNotification;
  }

  async sendEmailNotification(notificationData: CreateNotificationDto) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER || 'your-email@gmail.com',
        to: notificationData.userEmail || 'user@example.com',
        subject: notificationData.title || 'New Notification',
        text: notificationData.message,
        html: `<p>${notificationData.message}</p>`,
      };

      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Failed to send email notification:', error);
    }
  }

  async findByUser(userId: string): Promise<Notification[]> {
    if (!userId) {
      throw new BadRequestException('Invalid user ID');
    }
    return this.notificationRepository.find({
      where: { userId }, // ✅ camelCase property
      order: { createdAt: 'DESC' }, // ✅ camelCase property
    });
  }

  async markAsRead(id: string): Promise<Notification> {
    const result = await this.notificationRepository.update(id, {
      isRead: true,
    }); // camelCase

    if (result.affected === 0) {
      throw new NotFoundException('Notification not found');
    }

    const notification = await this.notificationRepository.findOne({
      where: { id },
    });
    if (!notification) {
      throw new NotFoundException('Notification not found');
    }
    return notification;
  }

  async remove(id: string): Promise<void> {
    const result = await this.notificationRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Notification not found');
    }
  }
}
