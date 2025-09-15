import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpException, HttpStatus, UseInterceptors } from '@nestjs/common';
import { AnswersService } from './answers.service';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuditInterceptor } from '../../common/interceptors/audit.interceptor';
import { Audit } from '../../common/decorators/audit.decorator';

@Controller('answers')
@UseGuards(JwtAuthGuard)
@UseInterceptors(AuditInterceptor)
export class AnswersController {
  constructor(private readonly answersService: AnswersService) {}

  @Post()
  @Audit({ action: 'CREATE_ANSWER', resource: 'Answer' })
  async create(@Body() createAnswerDto: CreateAnswerDto) {
    try {
      return await this.answersService.create(createAnswerDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async findAll() {
    return this.answersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.answersService.findOne(id);
  }

  @Patch(':id')
  @Audit({ action: 'UPDATE_ANSWER', resource: 'Answer' })
  async update(@Param('id') id: string, @Body() updateAnswerDto: UpdateAnswerDto) {
    return this.answersService.update(id, updateAnswerDto);
  }

  @Delete(':id')
  @Audit({ action: 'DELETE_ANSWER', resource: 'Answer' })
  async remove(@Param('id') id: string) {
    return this.answersService.remove(id);
  }

  @Get('question/:questionId')
  async findByQuestion(@Param('questionId') questionId: string) {
    return this.answersService.findByQuestion(questionId);
  }
}