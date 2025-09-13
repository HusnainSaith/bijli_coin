import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryFollowersService } from './category-followers.service';
import { CategoryFollowersController } from './category-followers.controller';
import { CategoryFollower } from './entities/category-follower.entity';
import { Post } from '../posts/entities/post.entity';   // ✅ correct Post entity

@Module({
  imports: [
    TypeOrmModule.forFeature([CategoryFollower, Post])  // ✅ include Post here
  ],
  controllers: [CategoryFollowersController],
  providers: [CategoryFollowersService],
  exports: [CategoryFollowersService], // optional, if used in other modules
})
export class CategoryFollowersModule {}
