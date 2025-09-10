import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from './entities/question.entity';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
  ) {}

  async create(createQuestionDto: CreateQuestionDto): Promise<Question> {
    const question = this.questionRepository.create(createQuestionDto);
    return this.questionRepository.save(question);
  }

  async findAll(): Promise<Question[]> {
    return this.questionRepository.find({ relations: ['user'] });
  }

  async findOne(id: number): Promise<Question> {
    if (!id || id <= 0) {
      throw new BadRequestException('Invalid question ID');
    }
    const question = await this.questionRepository.findOne({
      where: { id },
      relations: ['user', 'answers']
    });
    if (!question) {
      throw new NotFoundException('Question not found');
    }
    return question;
  }

  async update(id: number, updateQuestionDto: UpdateQuestionDto): Promise<Question> {
    const result = await this.questionRepository.update(id, updateQuestionDto);
    if (result.affected === 0) {
      throw new NotFoundException('Question not found');
    }
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.questionRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Question not found');
    }
  }

  async getAnswers(questionId: number) {
    if (!questionId || questionId <= 0) {
      throw new BadRequestException('Invalid question ID');
    }
    // Return empty array - implement when Answer entity is properly related
    return [];
  }
}