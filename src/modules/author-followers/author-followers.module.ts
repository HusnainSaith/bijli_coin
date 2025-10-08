import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorFollowersService } from './author-followers.service';
import { AuthorFollowersController } from './author-followers.controller';
import { AuthorFollower } from './entities/author-follower.entity';
import { AuditLogsModule } from '../audit-logs/audit-logs.module';

@Module({
  imports: [TypeOrmModule.forFeature([AuthorFollower]), AuditLogsModule],
  controllers: [AuthorFollowersController],
  providers: [AuthorFollowersService],
})
export class AuthorFollowersModule {}
