import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostTagsService } from './post-tags.service';
import { PostTagsController } from './post-tags.controller';
import { PostTag } from './entities/post-tag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PostTag])],
  controllers: [PostTagsController],
  providers: [PostTagsService],
})
export class PostTagsModule {}
