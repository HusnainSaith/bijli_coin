import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostMediaService } from './post-media.service';
import { PostMediaController } from './post-media.controller';
import { PostMedia } from './entities/post-media.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PostMedia])],
  controllers: [PostMediaController],
  providers: [PostMediaService],
})
export class PostMediaModule {}
