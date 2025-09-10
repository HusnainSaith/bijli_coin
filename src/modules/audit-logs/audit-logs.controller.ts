import { Controller, Get, Post, Body, Param, UseGuards, HttpException, HttpStatus, ParseIntPipe } from '@nestjs/common';
import { AuditLogsService } from './audit-logs.service';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('audit-logs')
@UseGuards(JwtAuthGuard)
export class AuditLogsController {
  constructor(private readonly auditLogsService: AuditLogsService) {}

  @Post()
  async create(@Body() createAuditLogDto: CreateAuditLogDto) {
    try {
      return await this.auditLogsService.create(createAuditLogDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async findAll() {
    return this.auditLogsService.findAll();
  }

  @Get('user/:userId')
  async findByUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.auditLogsService.findByUser(userId);
  }
}