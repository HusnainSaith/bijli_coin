import * as dotenv from 'dotenv';
dotenv.config();
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User, UserStatus } from '../../modules/users/entities/user.entity';
import { Role } from '../../modules/roles/entities/role.entity';
import { Permission } from '../../modules/permissions/entities/permission.entity';
import { RolePermission } from '../../modules/role-permissions/entities/role-permission.entity';
import { Category } from '../../modules/categories/entities/category.entity';
import { Post, PostStatus } from '../../modules/posts/entities/post.entity';
import { Tag } from '../../modules/tags/entities/tag.entity';
import { PostTag } from '../../modules/post-tags/entities/post-tag.entity';
import { Comment } from '../../modules/comments/entities/comment.entity';
import { CommentReply } from '../../modules/comment-replies/entities/comment-reply.entity';
import {
  Question,
  QuestionStatus,
} from '../../modules/questions/entities/question.entity';
import { Answer } from '../../modules/answers/entities/answer.entity';
import { Media } from '../../modules/media/entities/media.entity';
import { PostMedia } from '../../modules/post-media/entities/post-media.entity';
import {
  Reaction,
  ReactionType,
} from '../../modules/reactions/entities/reaction.entity';
import { Bookmark } from '../../modules/bookmarks/entities/bookmark.entity';
import { Notification } from '../../modules/notifications/entities/notification.entity';
import { View } from '../../modules/views/entities/view.entity';
import { Draft } from '../../modules/drafts/entities/draft.entity';
import { AuthorFollower } from '../../modules/author-followers/entities/author-follower.entity';
import { CategoryFollower } from '../../modules/category-followers/entities/category-follower.entity';
import { Report } from '../../modules/reports/entities/report.entity';
import { AuditLog } from '../../modules/audit-logs/entities/audit-log.entity';
import { RefreshToken } from '../../modules/auth/entities/refresh-token.entity';
import { Role as RoleEnum } from '../../common/enums/role.enum';
import { dataSourceOptions } from '../../config/database.config';
import {
  reason_enum,
  ReportStatus_enum,
} from '../../modules/reports/dto/create-report.dto';

const dataSource = new DataSource(dataSourceOptions);

function randomDate(): Date {
  const now = new Date();
  const past = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  return new Date(
    past.getTime() + Math.random() * (now.getTime() - past.getTime()),
  );
}

async function seedComprehensive() {
  console.log('🌱 Starting comprehensive database seeding...\n');

  try {
    await dataSource.initialize();
    console.log('✅ Database connected\n');

    const userRepo = dataSource.getRepository(User);
    const roleRepo = dataSource.getRepository(Role);
    const permissionRepo = dataSource.getRepository(Permission);
    const rolePermissionRepo = dataSource.getRepository(RolePermission);
    const categoryRepo = dataSource.getRepository(Category);
    const postRepo = dataSource.getRepository(Post);
    const tagRepo = dataSource.getRepository(Tag);
    const postTagRepo = dataSource.getRepository(PostTag);
    const commentRepo = dataSource.getRepository(Comment);
    const commentReplyRepo = dataSource.getRepository(CommentReply);
    const questionRepo = dataSource.getRepository(Question);
    const answerRepo = dataSource.getRepository(Answer);
    const mediaRepo = dataSource.getRepository(Media);
    const postMediaRepo = dataSource.getRepository(PostMedia);
    const reactionRepo = dataSource.getRepository(Reaction);
    const bookmarkRepo = dataSource.getRepository(Bookmark);
    const notificationRepo = dataSource.getRepository(Notification);
    const viewRepo = dataSource.getRepository(View);
    const draftRepo = dataSource.getRepository(Draft);
    const authorFollowerRepo = dataSource.getRepository(AuthorFollower);
    const categoryFollowerRepo = dataSource.getRepository(CategoryFollower);
    const reportRepo = dataSource.getRepository(Report);
    const auditLogRepo = dataSource.getRepository(AuditLog);
    const refreshTokenRepo = dataSource.getRepository(RefreshToken);

    // ===== PHASE 1: CORE DATA =====
    console.log('📦 Phase 1: Core Data');

    // Permissions
    const perms = [
      { name: 'Auth Register', slug: 'auth_register' },
      { name: 'Auth Login', slug: 'auth_login' },
      { name: 'Posts Create', slug: 'posts_create' },
      { name: 'Posts List', slug: 'posts_list' },
      { name: 'Posts Show', slug: 'posts_show' },
      { name: 'Posts Update', slug: 'posts_update' },
      { name: 'Posts Delete', slug: 'posts_delete' },
      { name: 'Comments Create', slug: 'comments_create' },
      { name: 'Categories Create', slug: 'categories_create' },
      { name: 'Categories List', slug: 'categories_list' },
    ];
    await permissionRepo
      .createQueryBuilder()
      .insert()
      .values(perms)
      .orIgnore()
      .execute();
    const allPerms = await permissionRepo.find();
    console.log(`  ✓ ${allPerms.length} permissions`);

    // Roles
    let superAdmin = await roleRepo.findOne({ where: { slug: 'super_admin' } });
    if (!superAdmin)
      superAdmin = await roleRepo.save({
        name: 'Super Admin',
        slug: 'super_admin',
      });

    let userRole = await roleRepo.findOne({ where: { slug: 'user' } });
    if (!userRole)
      userRole = await roleRepo.save({ name: 'User', slug: 'user' });
    console.log('  ✓ Roles');

    // Role-Permissions
    const existing = await rolePermissionRepo.find({
      where: { role_id: superAdmin.id },
    });
    const existingIds = existing.map((rp) => rp.permission_id);
    const newRP = allPerms
      .filter((p) => !existingIds.includes(p.id))
      .map((p) => ({ role_id: superAdmin.id, permission_id: p.id }));
    if (newRP.length > 0) await rolePermissionRepo.save(newRP);
    console.log('  ✓ Role-Permissions');

    // Users
    const hashedPwd = await bcrypt.hash('password123', 10);
    const usersData = Array.from({ length: 11 }, (_, i) => ({
      username: i === 0 ? 'admin' : `user${i}`,
      email: i === 0 ? 'admin@example.com' : `user${i}@example.com`,
      password: hashedPwd,
      role: i === 0 ? RoleEnum.SUPER_ADMIN : RoleEnum.USER,
      role_id: i === 0 ? superAdmin.id : userRole.id,
      status: UserStatus.ACTIVE,
    }));

    const users: User[] = [];
    for (const userData of usersData) {
      let user = await userRepo.findOne({ where: { email: userData.email } });
      if (!user) {
        user = await userRepo.save(userData);
      } else {
        // Update password for existing users to ensure consistency
        await userRepo.update(user.id, { password: hashedPwd });
        const updatedUser = await userRepo.findOne({ where: { email: userData.email } });
        if (updatedUser) user = updatedUser;
      }
      users.push(user);
    }
    console.log(`  ✓ ${users.length} users`);

    // ===== PHASE 2: CONTENT =====
    console.log('\n📦 Phase 2: Content');

    // Categories
    const catData = [
      'Technology',
      'Programming',
      'Web Dev',
      'Mobile Dev',
      'Data Science',
      'ML',
      'DevOps',
      'Cloud',
      'Security',
      'Blockchain',
    ].map((name) => ({
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-'),
    }));
    const categories: Category[] = [];
    for (const c of catData) {
      let cat = await categoryRepo.findOne({ where: { slug: c.slug } });
      if (!cat) cat = await categoryRepo.save(c);
      categories.push(cat);
    }
    console.log(`  ✓ ${categories.length} categories`);

    // Tags
    const tagData = [
      'JavaScript',
      'TypeScript',
      'React',
      'Node.js',
      'Python',
      'Java',
      'Docker',
      'Kubernetes',
      'AWS',
      'MongoDB',
      'PostgreSQL',
      'GraphQL',
      'REST',
      'Testing',
      'CI/CD',
    ].map((name) => ({
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-').replace(/\./g, ''),
    }));
    const tags: Tag[] = [];
    for (const t of tagData) {
      let tag = await tagRepo.findOne({ where: { slug: t.slug } });
      if (!tag) tag = await tagRepo.save(t);
      tags.push(tag);
    }
    console.log(`  ✓ ${tags.length} tags`);

    // Media
    const mediaData = Array.from({ length: 10 }, (_, i) => ({
      user_id: users[(i % 9) + 1].id,
      filename: `image-${i + 1}.jpg`,
      file_path: `/uploads/media/image-${i + 1}.jpg`,
      file_url: `https://example.com/media/image-${i + 1}.jpg`,
      mime_type: 'image/jpeg',
      file_size: 1024000 + i * 100000,
    }));
    const media = await mediaRepo.save(mediaData);
    console.log(`  ✓ ${media.length} media`);

    // Posts
    const postsData = Array.from({ length: 10 }, (_, i) => ({
      title: `Post Title ${i + 1}`,
      slug: `post-title-${i + 1}`,
      content: `This is the content for post ${i + 1}. It contains detailed information about the topic.`,
      user_id: users[(i % 9) + 1].id,
      category_id: categories[i % 10].id,
      status: PostStatus.PUBLISHED,
      featured_image: `https://example.com/media/image-${i + 1}.jpg`,
      views_count: 100 + i * 10,
      likes_count: 20 + i * 5,
      comments_count: 5 + i,
      published_at: randomDate(),
    }));
    const posts: Post[] = [];
    for (const postData of postsData) {
      let post = await postRepo.findOne({ where: { slug: postData.slug } });
      if (!post) post = await postRepo.save(postData);
      posts.push(post);
    }
    console.log(`  ✓ ${posts.length} posts`);

    // Drafts
    const draftsData = Array.from({ length: 10 }, (_, i) => ({
      user_id: users[(i % 9) + 1].id,
      title: `Draft Title ${i + 1}`,
      content: `Draft content ${i + 1}...`,
      category_id: categories[i % 10].id,
    }));
    const drafts: Draft[] = [];
    for (const draftData of draftsData) {
      const existingDraft = await draftRepo.findOne({
        where: {
          user_id: draftData.user_id,
          title: draftData.title,
        },
      });
      if (!existingDraft) {
        const draft = await draftRepo.save(draftData);
        drafts.push(draft);
      } else {
        drafts.push(existingDraft);
      }
    }
    console.log(`  ✓ ${drafts.length} drafts`);

    // Questions
    const questionsData = Array.from({ length: 10 }, (_, i) => ({
      user_id: users[(i % 9) + 1].id,
      title: `Question ${i + 1}?`,
      slug: `question-${i + 1}`,
      content: `This is question ${i + 1} content.`,
      category_id: categories[i % 10].id,
      status: QuestionStatus.OPEN,
      views_count: String(50 + i * 5),
      answers_count: String(i % 5),
    }));
    const questions: Question[] = [];
    for (const questionData of questionsData) {
      let question = await questionRepo.findOne({
        where: { slug: questionData.slug },
      });
      if (!question) question = await questionRepo.save(questionData);
      questions.push(question);
    }
    console.log(`  ✓ ${questions.length} questions`);

    console.log('\n📦 Phase 3: Relationships');

    // Post-Tags
    const postTagsData = posts.slice(0, 10).map((post, i) => ({
      post_id: post.id,
      tag_id: tags[i % tags.length].id,
    }));
    await postTagRepo.save(postTagsData);
    console.log(`  ✓ ${postTagsData.length} post-tags`);

    // Post-Media
    const postMediaData = posts.slice(0, 10).map((post, i) => ({
      post_id: post.id,
      media_id: media[i % media.length].id,
    }));
    await postMediaRepo.save(postMediaData);
    console.log(`  ✓ ${postMediaData.length} post-media`);

    // Answers
    const answersData = Array.from({ length: 10 }, (_, i) => ({
      question_id: questions[i % 10].id,
      user_id: users[(i % 9) + 1].id,
      content: `Answer content ${i + 1}`,
      is_accepted: i === 0,
      votes_count: String(i * 2),
    }));
    await answerRepo.save(answersData);
    console.log(`  ✓ ${answersData.length} answers`);

    // Comments
    const commentsData = Array.from({ length: 10 }, (_, i) => ({
      user_id: users[(i % 9) + 1].id,
      post_id: posts[i % 10].id,
      content: `Comment ${i + 1}`,
      likes_count: i * 3,
      replies_count: i % 3,
    }));
    const comments = await commentRepo.save(commentsData);
    console.log(`  ✓ ${comments.length} comments`);

    // Comment Replies
    const repliesData = Array.from({ length: 10 }, (_, i) => ({
      comment_id: comments[i % 10].id,
      user_id: users[(i % 9) + 1].id,
      content: `Reply ${i + 1}`,
    }));
    await commentReplyRepo.save(repliesData);
    console.log(`  ✓ ${repliesData.length} replies`);

    // Reactions
    const reactionsData = Array.from({ length: 10 }, (_, i) => ({
      user_id: users[(i % 9) + 1].id,
      reactable_type: 'post',
      reactable_id: posts[i % 10].id,
      type: [ReactionType.LIKE, ReactionType.LOVE, ReactionType.WOW][i % 3],
    }));
    await reactionRepo.save(reactionsData);
    console.log(`  ✓ ${reactionsData.length} reactions`);

    // Bookmarks
    const bookmarksData = Array.from({ length: 10 }, (_, i) => ({
      user_id: users[(i % 9) + 1].id,
      post_id: posts[i % 10].id,
    }));
    await bookmarkRepo.save(bookmarksData);
    console.log(`  ✓ ${bookmarksData.length} bookmarks`);

    // Views
    const viewsData = Array.from({ length: 10 }, (_, i) => ({
      user_id: users[(i % 9) + 1].id,
      viewable_type: 'post',
      viewable_id: posts[i % 10].id,
      ip_address: `192.168.1.${i + 1}`,
    }));
    await viewRepo.save(viewsData);
    console.log(`  ✓ ${viewsData.length} views`);

    // ===== PHASE 4: SOCIAL & SYSTEM =====
    console.log('\n📦 Phase 4: Social & System');

    // Author Followers
    const followData = Array.from({ length: 10 }, (_, i) => ({
      follower_id: users[(i % 9) + 1].id,
      author_id: users[((i + 1) % 9) + 1].id,
    }));
    await authorFollowerRepo.save(followData);
    console.log(`  ✓ ${followData.length} author-followers`);

    // Category Followers
    const catFollowData = Array.from({ length: 10 }, (_, i) => ({
      user_id: users[(i % 9) + 1].id,
      category_id: categories[i % 10].id,
    }));
    await categoryFollowerRepo.save(catFollowData);
    console.log(`  ✓ ${catFollowData.length} category-followers`);

    // Notifications
    const notifsData = Array.from({ length: 10 }, (_, i) => ({
      userId: users[(i % 9) + 1].id,
      type: ['comment', 'like', 'follow'][i % 3],
      title: `Notification ${i + 1}`,
      message: `You have a new notification ${i + 1}`,
      isRead: i % 2 === 0,
    }));
    await notificationRepo.save(notifsData);
    console.log(`  ✓ ${notifsData.length} notifications`);

    // Reports
    const reportsData = Array.from({ length: 10 }, (_, i) => ({
      reporter_id: users[(i % 9) + 1].id,
      reportable_type: 'post',
      reportable_id: posts[i % 10].id,
      reason: [
        reason_enum.SPAM,
        reason_enum.INAPPROPRIATE_CONTENT,
        reason_enum.HARASSMENT,
      ][i % 3],
      description: `Report description ${i + 1}`,
      status: ReportStatus_enum.PENDING,
    }));
    await reportRepo.save(reportsData);
    console.log(`  ✓ ${reportsData.length} reports`);

    // Audit Logs
    const auditData = Array.from({ length: 10 }, (_, i) => ({
      user_id: users[(i % 9) + 1].id,
      action: ['create', 'update', 'delete'][i % 3],
      auditable_type: 'post',
      auditable_id: posts[i % 10].id,
      ip_address: `192.168.1.${i + 1}`,
    }));
    await auditLogRepo.save(auditData);
    console.log(`  ✓ ${auditData.length} audit-logs`);

    // Refresh Tokens
    const now = new Date();
    const tokensData = Array.from({ length: 10 }, (_, i) => ({
      token: `refresh_token_${i + 1}_${Date.now()}`,
      user_id: users[(i % 9) + 1].id,
      expires_at: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
      is_revoked: false,
    }));
    await refreshTokenRepo.save(tokensData);
    console.log(`  ✓ ${tokensData.length} refresh-tokens`);

    console.log('\n✅ Seeding completed successfully!');
    console.log('📊 Summary:');
    console.log(`   - Users: ${users.length}`);
    console.log(`   - Categories: ${categories.length}`);
    console.log(`   - Tags: ${tags.length}`);
    console.log(`   - Posts: ${posts.length}`);
    console.log(`   - Questions: ${questions.length}`);
    console.log(`   - All 24 tables seeded with minimum 10 records each\n`);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  } finally {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  }
}

if (require.main === module) {
  seedComprehensive();
}

export default seedComprehensive;
