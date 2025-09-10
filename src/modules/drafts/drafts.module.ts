import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DraftsService } from './drafts.service';
import { DraftsController } from './drafts.controller';
import { Draft } from './entities/draft.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Draft])],
  controllers: [DraftsController],
  providers: [DraftsService],
})
export class DraftsModule {}