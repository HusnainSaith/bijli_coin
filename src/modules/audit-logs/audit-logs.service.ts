import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './entities/audit-log.entity';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';

@Injectable()
export class AuditLogsService {
  constructor(
    @InjectRepository(AuditLog)
    private auditLogRepository: Repository<AuditLog>,
  ) {}

  async create(createAuditLogDto: CreateAuditLogDto): Promise<AuditLog> {
    const auditLog = this.auditLogRepository.create(createAuditLogDto);
    return this.auditLogRepository.save(auditLog);
  }

  async findAll(): Promise<AuditLog[]> {
    return this.auditLogRepository.find({
      relations: ['user'],
      order: { created_at: 'DESC' }
    });
  }

  async findByUser(userId: number): Promise<AuditLog[]> {
    if (!userId || userId <= 0) {
      throw new BadRequestException('Invalid user ID');
    }
    return this.auditLogRepository.find({
      where: { user_id: userId },
      relations: ['user'],
      order: { created_at: 'DESC' }
    });
  }
}