import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryFollowersService } from './category-followers.service';
import { CategoryFollowersController } from './category-followers.controller';
import { CategoryFollower } from './entities/category-follower.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryFollower])],
  controllers: [CategoryFollowersController],
  providers: [CategoryFollowersService],
})
export class CategoryFollowersModule {}