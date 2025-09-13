import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { DraftsService } from './drafts.service';
import { CreateDraftDto } from './dto/create-draft.dto';
import { UpdateDraftDto } from './dto/update-draft.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('drafts')
@UseGuards(JwtAuthGuard)
export class DraftsController {
  constructor(private readonly draftsService: DraftsService) {}

  @Post()
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
  async update(@Param('id') id: string, @Body() updateDraftDto: UpdateDraftDto) {
    return this.draftsService.update(id, updateDraftDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.draftsService.remove(id);
  }

  @Get('user/:userId')
  async findByUser(@Param('userId') userId: string) {
    return this.draftsService.findByUser(userId);
  }
}