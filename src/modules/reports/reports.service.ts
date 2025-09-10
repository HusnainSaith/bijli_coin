import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './entities/report.entity';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private reportRepository: Repository<Report>,
  ) {}

  async create(createReportDto: CreateReportDto): Promise<Report> {
    const report = this.reportRepository.create(createReportDto);
    return this.reportRepository.save(report);
  }

  async findAll(): Promise<Report[]> {
    return this.reportRepository.find({ relations: ['user'] });
  }

  async findOne(id: number): Promise<Report> {
    const safeId = Number(id);
    if (!Number.isInteger(safeId) || safeId <= 0) {
      throw new NotFoundException('Invalid report id');
    }
    const report = await this.reportRepository.findOne({
      where: { id: safeId },
      relations: ['user']
    });
    if (!report) {
      throw new NotFoundException('Report not found');
    }
    return report;
  }

  async update(id: number, updateReportDto: UpdateReportDto): Promise<Report> {
    if (typeof id !== 'number' || isNaN(id) || !Number.isInteger(id) || id <= 0) {
      throw new NotFoundException('Invalid report id');
    }
    const result = await this.reportRepository.update(id, updateReportDto);
    if (result.affected === 0) {
      throw new NotFoundException('Report not found');
    }
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.reportRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Report not found');
    }
  }

  async findByUser(userId: number): Promise<Report[]> {
    return this.reportRepository.find({
      where: { reporter_id: userId },
      relations: ['reporter']
    });
  }
}