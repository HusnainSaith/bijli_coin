import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AutoPermissionsGuard } from './common/guards/auto-permissions.guard';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';

import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { PostsModule } from './modules/posts/posts.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { CommentsModule } from './modules/comments/comments.module';
import { QuestionsModule } from './modules/questions/questions.module';
import { AnswersModule } from './modules/answers/answers.module';
import { BookmarksModule } from './modules/bookmarks/bookmarks.module';
import { ReactionsModule } from './modules/reactions/reactions.module';
import { TagsModule } from './modules/tags/tags.module';
import { MediaModule } from './modules/media/media.module';
import { DraftsModule } from './modules/drafts/drafts.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { RolesModule } from './modules/roles/roles.module';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { ReportsModule } from './modules/reports/reports.module';
import { ViewsModule } from './modules/views/views.module';
// import { TrackingModule } from './modules/tracking/tracking.module';
// import { RecommendationsModule } from './modules/recommendations/recommendations.module';
import { AuditLogsModule } from './modules/audit-logs/audit-logs.module';
import { AuthorFollowersModule } from './modules/author-followers/author-followers.module';
import { CategoryFollowersModule } from './modules/category-followers/category-followers.module';
import { CommentRepliesModule } from './modules/comment-replies/comment-replies.module';
import { PostMediaModule } from './modules/post-media/post-media.module';
import { PostTagsModule } from './modules/post-tags/post-tags.module';
import { RolePermissionsModule } from './modules/role-permissions/role-permissions.module';
// import { FollowersModule } from './modules/followers/followers.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'blog_api',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      migrations: [__dirname + '/database/migrations/*{.ts,.js}'],
      synchronize: false,
      logging: true,
    }),
    AuthModule,
    UsersModule,
    PostsModule,
    CategoriesModule,
    CommentsModule,
    QuestionsModule,
    AnswersModule,
    BookmarksModule,
    ReactionsModule,
    TagsModule,
    MediaModule,
    DraftsModule,
    NotificationsModule,
    RolesModule,
    PermissionsModule,
    ReportsModule,
    ViewsModule,
    // TrackingModule,
    // RecommendationsModule,
    AuditLogsModule,
    AuthorFollowersModule,
    CategoryFollowersModule,
    CommentRepliesModule,
    PostMediaModule,
    PostTagsModule,
    RolePermissionsModule,
    // FollowersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AutoPermissionsGuard,
    },
  ],
})
export class AppModule {}
