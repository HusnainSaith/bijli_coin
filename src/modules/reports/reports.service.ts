import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './entities/report.entity';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>,
  ) {}

  // ✅ CREATE
  async create(createReportDto: CreateReportDto): Promise<Report> {
    if (!createReportDto.reporter_id || !createReportDto.reportable_id) {
      throw new BadRequestException('Missing required fields');
    }

    const report = this.reportRepository.create(createReportDto);
    return await this.reportRepository.save(report);
  }

  // ✅ FIND ALL
  async findAll(): Promise<Report[]> {
    return await this.reportRepository.find({ relations: ['user'] });
  }

  // ✅ FIND ONE
  async findOne(id: string): Promise<Report> {
    if (!id || typeof id !== 'string' || id.trim() === '') {
      throw new BadRequestException('Invalid report ID provided');
    }

    const report = await this.reportRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!report) {
      throw new NotFoundException(`Report with ID "${id}" not found`);
    }

    return report;
  }

  // ✅ UPDATE
  async update(id: string, updateReportDto: UpdateReportDto): Promise<Report> {
    if (!id || typeof id !== 'string' || id.trim() === '') {
      throw new BadRequestException('Invalid report ID provided');
    }

    const result = await this.reportRepository.update(id, updateReportDto);

    if (result.affected === 0) {
      throw new NotFoundException(`Report with ID "${id}" not found`);
    }

    return this.findOne(id);
  }

  // ✅ REMOVE
  async remove(id: string): Promise<void> {
    if (!id || typeof id !== 'string' || id.trim() === '') {
      throw new BadRequestException('Invalid report ID provided');
    }

    const result = await this.reportRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Report with ID "${id}" not found`);
    }
  }

  // ✅ FIND BY USER
  async findByUser(userId: string): Promise<Report[]> {
    if (!userId || typeof userId !== 'string' || userId.trim() === '') {
      throw new BadRequestException('Invalid user ID provided');
    }

    const reports = await this.reportRepository.find({
      where: { user: { id: userId } }, // relation field
      relations: ['user'],
    });

    if (!reports || reports.length === 0) {
      throw new NotFoundException(
        `No reports found for user with ID "${userId}"`,
      );
    }

    return reports;
  }
}
