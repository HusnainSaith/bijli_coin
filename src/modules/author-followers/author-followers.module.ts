import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorFollowersService } from './author-followers.service';
import { AuthorFollowersController } from './author-followers.controller';
import { AuthorFollower } from './entities/author-follower.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AuthorFollower])],
  controllers: [AuthorFollowersController],
  providers: [AuthorFollowersService],
})
export class AuthorFollowersModule {}