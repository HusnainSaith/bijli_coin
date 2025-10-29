import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from './entities/question.entity';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Answer } from '../answers/entities/answer.entity';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
    @InjectRepository(Answer)
    private answersRepository: Repository<Answer>,
  ) {}

  async create(createQuestionDto: CreateQuestionDto): Promise<Question> {
    const question = this.questionRepository.create(createQuestionDto);
    return this.questionRepository.save(question);
  }

  async findAll(): Promise<Question[]> {
    return this.questionRepository.find({ relations: ['user'] });
  }

  async findOne(id: string): Promise<Question> {
    if (!id) {
      throw new BadRequestException('Invalid question ID');
    }
    const question = await this.questionRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!question) {
      throw new NotFoundException('Question not found');
    }
    return question;
  }

  async update(
    id: string,
    updateQuestionDto: UpdateQuestionDto,
  ): Promise<Question> {
    const result = await this.questionRepository.update(id, updateQuestionDto);
    if (result.affected === 0) {
      throw new NotFoundException('Question not found');
    }
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const result = await this.questionRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Question not found');
    }
  }

  async incrementViews(id: string): Promise<Question> {
    const question = await this.findOne(id);
    await this.questionRepository.increment({ id }, 'views_count', 1);
    return this.findOne(id);
  }
}
