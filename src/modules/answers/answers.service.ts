import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Answer } from './entities/answer.entity';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';

@Injectable()
export class AnswersService {
  constructor(
    @InjectRepository(Answer)
    private answerRepository: Repository<Answer>,
  ) {}

  async create(createAnswerDto: CreateAnswerDto): Promise<Answer> {
    const answer = this.answerRepository.create(createAnswerDto);
    return this.answerRepository.save(answer);
  }

  async findAll(): Promise<Answer[]> {
    return this.answerRepository.find({ relations: ['user', 'question'] });
  }

  async findOne(id: number): Promise<Answer> {
    if (typeof id !== 'number' || isNaN(id) || id <= 0) {
      throw new BadRequestException('Invalid answer ID');
    }
    const answer = await this.answerRepository.findOne({
      where: { id },
      relations: ['user', 'question']
    });
    if (!answer) {
      throw new NotFoundException('Answer not found');
    }
    return answer;
  }

  async update(id: number, updateAnswerDto: UpdateAnswerDto): Promise<Answer> {
    if (typeof id !== 'number' || isNaN(id) || id <= 0) {
      throw new BadRequestException('Invalid answer ID');
    }
    const result = await this.answerRepository.update(id, updateAnswerDto);
    if (result.affected === 0) {
      throw new NotFoundException('Answer not found');
    }
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    if (typeof id !== 'number' || isNaN(id) || id <= 0) {
      throw new BadRequestException('Invalid answer ID');
    }
    const result = await this.answerRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Answer not found');
    }
  }

  async findByQuestion(questionId: number): Promise<Answer[]> {
    if (!questionId || questionId <= 0) {
      throw new BadRequestException('Invalid question ID');
    }
    return this.answerRepository.find({
      where: { question_id: questionId },
      relations: ['user']
    });
  }
}