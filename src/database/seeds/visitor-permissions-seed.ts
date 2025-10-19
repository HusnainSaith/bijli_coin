import * as dotenv from 'dotenv';
dotenv.config();
import { DataSource } from 'typeorm';
import { Role } from '../../modules/roles/entities/role.entity';
import { Permission } from '../../modules/permissions/entities/permission.entity';
import { RolePermission } from '../../modules/role-permissions/entities/role-permission.entity';
import { dataSourceOptions } from '../../config/database.config';

const dataSource = new DataSource(dataSourceOptions);

async function seedVisitorPermissions() {
  console.log('🌱 Starting Visitor Role Permissions Seeding...\n');

  try {
    await dataSource.initialize();
    console.log('✅ Database connected\n');

    const roleRepo = dataSource.getRepository(Role);
    const permissionRepo = dataSource.getRepository(Permission);
    const rolePermissionRepo = dataSource.getRepository(RolePermission);

    // ===== CREATE VISITOR ROLE =====
    console.log('📦 Creating Visitor Role...');
    let visitorRole = await roleRepo.findOne({ where: { slug: 'visitor' } });
    if (!visitorRole) {
      visitorRole = await roleRepo.save({
        name: 'Visitor',
        slug: 'visitor',
      });
      console.log('  ✓ Visitor role created');
    } else {
      console.log('  ✓ Visitor role already exists');
    }

    // ===== CREATE ALL VISITOR PERMISSIONS =====
    console.log('\n📦 Creating Visitor Permissions...');

    const visitorPermissions = [
      // ===== AUTH =====
      { name: 'Auth Register', slug: 'auth_register' },
      { name: 'Auth Login', slug: 'auth_login' },
      { name: 'Auth Logout', slug: 'auth_logout' },
      { name: 'Auth Refresh', slug: 'auth_refresh' },
      { name: 'Auth Forgot Password', slug: 'auth_forgot_password' },
      { name: 'Auth Reset Password', slug: 'auth_reset_password' },

      // ===== USERS =====
      { name: 'Read User', slug: 'read_user' },
      { name: 'Read User Profile', slug: 'read_user_profile' },
      { name: 'Read User Posts', slug: 'read_user_posts' },
      { name: 'Read Own Drafts', slug: 'read_own_drafts' },
      { name: 'Read User Bookmarks', slug: 'read_user_bookmarks' },
      { name: 'Read User Followers', slug: 'read_user_followers' },
      { name: 'Read User Following', slug: 'read_user_following' },
      { name: 'Read User Notifications', slug: 'read_user_notifications' },
      { name: 'Update Own Profile', slug: 'update_own_profile' },

      // ===== POSTS =====
      { name: 'Read Post', slug: 'read_post' },
      { name: 'Read Posts', slug: 'read_posts' },
      { name: 'Create Post', slug: 'create_post' },
      { name: 'Update Own Post', slug: 'update_own_post' },
      { name: 'Delete Own Post', slug: 'delete_own_post' },
      { name: 'Read Post Comments', slug: 'read_post_comments' },
      { name: 'Read Post Media', slug: 'read_post_media' },
      { name: 'Read Post Tags', slug: 'read_post_tags' },
      { name: 'Read Post Reactions', slug: 'read_post_reactions' },

      // ===== COMMENTS =====
      { name: 'Create Comment', slug: 'create_comment' },
      { name: 'Read Comment', slug: 'read_comment' },
      { name: 'Read Comments', slug: 'read_comments' },
      { name: 'Update Own Comment', slug: 'update_own_comment' },
      { name: 'Delete Own Comment', slug: 'delete_own_comment' },
      { name: 'Read Comment Replies', slug: 'read_comment_replies' },

      // ===== COMMENT REPLIES =====
      { name: 'Create Comment Reply', slug: 'create_comment_reply' },
      { name: 'Read Comment Reply', slug: 'read_comment_reply' },
      { name: 'Update Own Reply', slug: 'update_own_reply' },
      { name: 'Delete Own Reply', slug: 'delete_own_reply' },

      // ===== BOOKMARKS =====
      { name: 'Create Bookmark', slug: 'create_bookmark' },
      { name: 'Read Bookmark', slug: 'read_bookmark' },
      { name: 'Delete Bookmark', slug: 'delete_bookmark' },

      // ===== REACTIONS =====
      { name: 'Create Reaction', slug: 'create_reaction' },
      { name: 'Read Reaction', slug: 'read_reaction' },
      { name: 'Delete Reaction', slug: 'delete_reaction' },

      // ===== TAGS =====
      { name: 'Read Tag', slug: 'read_tag' },
      { name: 'Read Tags', slug: 'read_tags' },
      { name: 'Read Tag Posts', slug: 'read_tag_posts' },

      // ===== CATEGORIES =====
      { name: 'Read Category', slug: 'read_category' },
      { name: 'Read Categories', slug: 'read_categories' },
      { name: 'Read Category Posts', slug: 'read_category_posts' },
      { name: 'Read Category Followers', slug: 'read_category_followers' },

      // ===== CATEGORY FOLLOWERS =====
      { name: 'Create Category Follower', slug: 'create_category_follower' },
      { name: 'Read Category Follower', slug: 'read_category_follower' },
      { name: 'Delete Category Follower', slug: 'delete_category_follower' },

      // ===== MEDIA =====
      { name: 'Create Media', slug: 'create_media' },
      { name: 'Read Media', slug: 'read_media' },
      { name: 'Delete Own Media', slug: 'delete_own_media' },

      // ===== DRAFTS =====
      { name: 'Create Draft', slug: 'create_draft' },
      { name: 'Read Own Draft', slug: 'read_own_draft' },
      { name: 'Update Own Draft', slug: 'update_own_draft' },
      { name: 'Delete Own Draft', slug: 'delete_own_draft' },

      // ===== NOTIFICATIONS =====
      { name: 'Read Notification', slug: 'read_notification' },
      { name: 'Update Notification', slug: 'update_notification' },
      { name: 'Delete Notification', slug: 'delete_notification' },

      // ===== QUESTIONS =====
      { name: 'Create Question', slug: 'create_question' },
      { name: 'Read Question', slug: 'read_question' },
      { name: 'Read Questions', slug: 'read_questions' },

      // ===== ANSWERS =====
      { name: 'Create Answer', slug: 'create_answer' },
      { name: 'Read Answer', slug: 'read_answer' },
      { name: 'Update Own Answer', slug: 'update_own_answer' },
      { name: 'Delete Own Answer', slug: 'delete_own_answer' },

      // ===== AUTHOR FOLLOWERS =====
      { name: 'Create Author Follower', slug: 'create_author_follower' },
      { name: 'Read Author Followers', slug: 'read_author_followers' },
      { name: 'Read Author Following', slug: 'read_author_following' },
      { name: 'Delete Author Follower', slug: 'delete_author_follower' },

      // ===== VIEWS =====
      { name: 'Create View', slug: 'create_view' },
      { name: 'Read View', slug: 'read_view' },

      // ===== RECOMMENDATIONS =====
      { name: 'Create Recommendation', slug: 'create_recommendation' },
      { name: 'Read Recommendation', slug: 'read_recommendation' },

      // ===== REPORTS =====
      { name: 'Create Report', slug: 'create_report' },
    ];

    // Insert permissions (ignore duplicates)
    let createdCount = 0;
    let existingCount = 0;

    for (const perm of visitorPermissions) {
      const existing = await permissionRepo.findOne({
        where: { slug: perm.slug },
      });
      if (!existing) {
        await permissionRepo.save(perm);
        createdCount++;
      } else {
        existingCount++;
      }
    }

    console.log(`  ✓ ${createdCount} new permissions created`);
    console.log(`  ✓ ${existingCount} permissions already existed`);

    // ===== LINK PERMISSIONS TO VISITOR ROLE =====
    console.log('\n📦 Linking Permissions to Visitor Role...');

    const allVisitorPermissions = await permissionRepo
      .createQueryBuilder('permission')
      .where('permission.slug IN (:...slugs)', {
        slugs: visitorPermissions.map((p) => p.slug),
      })
      .getMany();

    // Get existing role permissions
    const existingRolePermissions = await rolePermissionRepo.find({
      where: { role_id: visitorRole.id },
    });
    const existingPermissionIds = existingRolePermissions.map(
      (rp) => rp.permission_id,
    );

    // Create new role permissions
    const newRolePermissions = allVisitorPermissions
      .filter((p) => !existingPermissionIds.includes(p.id))
      .map((p) => ({
        role_id: visitorRole.id,
        permission_id: p.id,
      }));

    if (newRolePermissions.length > 0) {
      await rolePermissionRepo.save(newRolePermissions);
      console.log(
        `  ✓ ${newRolePermissions.length} new role-permissions created`,
      );
    } else {
      console.log('  ✓ All permissions already linked to visitor role');
    }

    console.log('\n✅ Visitor Permissions Seeding Completed!');
    console.log('📊 Summary:');
    console.log(`   - Visitor Role: Created/Verified`);
    console.log(
      `   - Total Permissions for Visitors: ${allVisitorPermissions.length}`,
    );
    console.log(`   - All visitor permissions are now active\n`);
  } catch (error: unknown) {
    console.error(
      '❌ Seed error:',
      error instanceof Error ? error.message : String(error),
    );
    process.exit(1);
  } finally {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  }
}

if (require.main === module) {
  void seedVisitorPermissions();
}

export default seedVisitorPermissions;
