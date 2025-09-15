import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpException, HttpStatus, UseInterceptors } from '@nestjs/common';
import { DraftsService } from './drafts.service';
import { CreateDraftDto } from './dto/create-draft.dto';
import { UpdateDraftDto } from './dto/update-draft.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuditInterceptor } from '../../common/interceptors/audit.interceptor';
import { Audit } from '../../common/decorators/audit.decorator';

@Controller('drafts')
@UseGuards(JwtAuthGuard)
@UseInterceptors(AuditInterceptor)
export class DraftsController {
  constructor(private readonly draftsService: DraftsService) {}

  @Post()
  @Audit({ action: 'CREATE_DRAFT', resource: 'Draft' })
  async create(@Body() createDraftDto: CreateDraftDto) {
    try {
      return await this.draftsService.create(createDraftDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async findAll() {
    return this.draftsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.draftsService.findOne(id);
  }

  @Patch(':id')
  @Audit({ action: 'UPDATE_DRAFT', resource: 'Draft' })
  async update(@Param('id') id: string, @Body() updateDraftDto: UpdateDraftDto) {
    return this.draftsService.update(id, updateDraftDto);
  }

  @Delete(':id')
  @Audit({ action: 'DELETE_DRAFT', resource: 'Draft' })
  async remove(@Param('id') id: string) {
    return this.draftsService.remove(id);
  }

  @Get('user/:userId')
  async findByUser(@Param('userId') userId: string) {
    return this.draftsService.findByUser(userId);
  }
}