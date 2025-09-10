import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export function ValidateId() {
  return applyDecorators(
    Transform(({ value }) => parseInt(value)),
    IsInt({ message: 'ID must be an integer' }),
    Min(1, { message: 'ID must be greater than 0' })
  );
}