import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { Post } from './entities/post.entity';
import { ViewsModule } from '../views/views.module';
import { AuditLogsModule } from '../audit-logs/audit-logs.module';

@Module({
  imports: [TypeOrmModule.forFeature([Post]), ViewsModule, AuditLogsModule],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
