// import * as dotenv from 'dotenv';
// dotenv.config();
// import { DataSource } from 'typeorm';
// import * as bcrypt from 'bcryptjs';
// import { User, UserStatus } from '../../modules/users/entities/user.entity';
// import { Role } from '../../modules/roles/entities/role.entity';
// import { Permission } from '../../modules/permissions/entities/permission.entity';
// import { RolePermission } from '../../modules/role-permissions/entities/role-permission.entity';
// import { Role as RoleEnum } from '../../common/enums/role.enum';
// import { dataSourceOptions } from '../../config/database.config';

// const dataSource = new DataSource(dataSourceOptions);

// async function seed() {
//   try {
//     await dataSource.initialize();
//     const userRepo = dataSource.getRepository(User);
//     const roleRepo = dataSource.getRepository(Role);
//     const permissionRepo = dataSource.getRepository(Permission);
//     const rolePermissionRepo = dataSource.getRepository(RolePermission);

//     // New permissions to be added
//     const newPermissions = [
//   { name: 'Auth Register', slug: 'auth_register' },
//   { name: 'Auth Login', slug: 'auth_login' },
//   { name: 'Auth Refresh', slug: 'auth_refresh' },
//   { name: 'Auth Logout', slug: 'auth_logout' },
//   { name: 'Auth Forgot Password', slug: 'auth_forgot_password' },
//   { name: 'Auth Reset Password', slug: 'auth_reset_password' },
//   { name: 'Users Create', slug: 'users_create' },
//   { name: 'Users List', slug: 'users_list' },
//   { name: 'Users Show', slug: 'users_show' },
//   { name: 'Users Update', slug: 'users_update' },
//   { name: 'Users Delete', slug: 'users_delete' },
//   { name: 'Users Profile', slug: 'users_profile' },
//   { name: 'Users Posts', slug: 'users_posts' },
//   { name: 'Users Drafts', slug: 'users_drafts' },
//   { name: 'Users Bookmarks', slug: 'users_bookmarks' },
//   { name: 'Users Followers', slug: 'users_followers' },
//   { name: 'Users Following', slug: 'users_following' },
//   { name: 'Users Notifications', slug: 'users_notifications' },
//   { name: 'Roles Create', slug: 'roles_create' },
//   { name: 'Roles List', slug: 'roles_list' },
//   { name: 'Roles Show', slug: 'roles_show' },
//   { name: 'Roles Update', slug: 'roles_update' },
//   { name: 'Roles Delete', slug: 'roles_delete' },
//   { name: 'Roles Permissions', slug: 'roles_permissions' },
//   { name: 'Roles Users', slug: 'roles_users' },
//   { name: 'Permissions Create', slug: 'permissions_create' },
//   { name: 'Permissions List', slug: 'permissions_list' },
//   { name: 'Permissions Show', slug: 'permissions_show' },
//   { name: 'Permissions Update', slug: 'permissions_update' },
//   { name: 'Permissions Delete', slug: 'permissions_delete' },
//   { name: 'Permissions Roles', slug: 'permissions_roles' },
//   { name: 'Posts Create', slug: 'posts_create' },
//   { name: 'Posts List', slug: 'posts_list' },
//   { name: 'Posts Show', slug: 'posts_show' },
//   { name: 'Posts Update', slug: 'posts_update' },
//   { name: 'Posts Delete', slug: 'posts_delete' },
//   { name: 'Posts Comments', slug: 'posts_comments' },
//   { name: 'Posts Media', slug: 'posts_media' },
//   { name: 'Posts Tags', slug: 'posts_tags' },
//   { name: 'Posts Reactions', slug: 'posts_reactions' },
//   { name: 'Categories Create', slug: 'categories_create' },
//   { name: 'Categories List', slug: 'categories_list' },
//   { name: 'Categories Show', slug: 'categories_show' },
//   { name: 'Categories Update', slug: 'categories_update' },
//   { name: 'Categories Delete', slug: 'categories_delete' },
//   { name: 'Categories Posts', slug: 'categories_posts' },
//   { name: 'Categories Followers', slug: 'categories_followers' },
//   { name: 'Comments Create', slug: 'comments_create' },
//   { name: 'Comments List', slug: 'comments_list' },
//   { name: 'Comments Show', slug: 'comments_show' },
//   { name: 'Comments Update', slug: 'comments_update' },
//   { name: 'Comments Delete', slug: 'comments_delete' },
//   { name: 'Comments Replies', slug: 'comments_replies' },
//   { name: 'Media Create', slug: 'media_create' },
//   { name: 'Media List', slug: 'media_list' },
//   { name: 'Media Show', slug: 'media_show' },
//   { name: 'Media Update', slug: 'media_update' },
//   { name: 'Media Delete', slug: 'media_delete' },
//   { name: 'Media By User', slug: 'media_by_user' },
//   { name: 'Answers Create', slug: 'answers_create' },
//   { name: 'Answers List', slug: 'answers_list' },
//   { name: 'Answers Show', slug: 'answers_show' },
//   { name: 'Answers Update', slug: 'answers_update' },
//   { name: 'Answers Delete', slug: 'answers_delete' },
//   { name: 'Audit Logs List', slug: 'audit_logs_list' },
//   { name: 'Audit Logs Show', slug: 'audit_logs_show' },
//   { name: 'Author Followers Create', slug: 'author_followers_create' },
//   { name: 'Author Followers List', slug: 'author_followers_list' },
//   { name: 'Author Followers Delete', slug: 'author_followers_delete' },
//   { name: 'Bookmarks Create', slug: 'bookmarks_create' },
//   { name: 'Bookmarks List', slug: 'bookmarks_list' },
//   { name: 'Bookmarks Delete', slug: 'bookmarks_delete' },
//   { name: 'Category Followers Create', slug: 'category_followers_create' },
//   { name: 'Category Followers List', slug: 'category_followers_list' },
//   { name: 'Category Followers Delete', slug: 'category_followers_delete' },
//   { name: 'Comment Replies Create', slug: 'comment_replies_create' },
//   { name: 'Comment Replies List', slug: 'comment_replies_list' },
//   { name: 'Comment Replies Show', slug: 'comment_replies_show' },
//   { name: 'Comment Replies Update', slug: 'comment_replies_update' },
//   { name: 'Comment Replies Delete', slug: 'comment_replies_delete' },
//   { name: 'Drafts Create', slug: 'drafts_create' },
//   { name: 'Drafts List', slug: 'drafts_list' },
//   { name: 'Drafts Show', slug: 'drafts_show' },
//   { name: 'Drafts Update', slug: 'drafts_update' },
//   { name: 'Drafts Delete', slug: 'drafts_delete' },
//   { name: 'Followers Create', slug: 'followers_create' },
//   { name: 'Followers List', slug: 'followers_list' },
//   { name: 'Followers Delete', slug: 'followers_delete' },
//   { name: 'Notifications Create', slug: 'notifications_create' },
//   { name: 'Notifications List', slug: 'notifications_list' },
//   { name: 'Notifications Show', slug: 'notifications_show' },
//   { name: 'Notifications Update', slug: 'notifications_update' },
//   { name: 'Notifications Delete', slug: 'notifications_delete' },
//   { name: 'Post Media Create', slug: 'post_media_create' },
//   { name: 'Post Media List', slug: 'post_media_list' },
//   { name: 'Post Media Delete', slug: 'post_media_delete' },
//   { name: 'Post Tags Create', slug: 'post_tags_create' },
//   { name: 'Post Tags List', slug: 'post_tags_list' },
//   { name: 'Post Tags Delete', slug: 'post_tags_delete' },
//   { name: 'Questions Create', slug: 'questions_create' },
//   { name: 'Questions List', slug: 'questions_list' },
//   { name: 'Questions Show', slug: 'questions_show' },
//   { name: 'Questions Update', slug: 'questions_update' },
//   { name: 'Questions Delete', slug: 'questions_delete' },
//   { name: 'Reactions Create', slug: 'reactions_create' },
//   { name: 'Reactions List', slug: 'reactions_list' },
//   { name: 'Reactions Show', slug: 'reactions_show' },
//   { name: 'Reactions Update', slug: 'reactions_update' },
//   { name: 'Reactions Delete', slug: 'reactions_delete' },
//   { name: 'Recommendations List', slug: 'recommendations_list' },
//   { name: 'Recommendations Show', slug: 'recommendations_show' },
//   { name: 'Reports Create', slug: 'reports_create' },
//   { name: 'Reports List', slug: 'reports_list' },
//   { name: 'Reports Show', slug: 'reports_show' },
//   { name: 'Reports Update', slug: 'reports_update' },
//   { name: 'Reports Delete', slug: 'reports_delete' },
//   { name: 'Role Permissions Create', slug: 'role_permissions_create' },
//   { name: 'Role Permissions List', slug: 'role_permissions_list' },
//   { name: 'Role Permissions Delete', slug: 'role_permissions_delete' },
//   { name: 'Tags Create', slug: 'tags_create' },
//   { name: 'Tags List', slug: 'tags_list' },
//   { name: 'Tags Show', slug: 'tags_show' },
//   { name: 'Tags Update', slug: 'tags_update' },
//   { name: 'Tags Delete', slug: 'tags_delete' },
//   { name: 'Tracking Create', slug: 'tracking_create' },
//   { name: 'Tracking List', slug: 'tracking_list' },
//   { name: 'Tracking Show', slug: 'tracking_show' },
//   { name: 'Views Create', slug: 'views_create' },
//   { name: 'Views List', slug: 'views_list' },
//   { name: 'Views Show', slug: 'views_show' },
//   { name: 'create user', slug: 'create_user' },
//   { name: 'read user', slug: 'read_user' },
//   { name: 'update user', slug: 'update_user' },
//   { name: 'delete user', slug: 'delete_user' },
//   { name: 'create role', slug: 'create_role' },
//   { name: 'read role', slug: 'read_role' },
//   { name: 'update role', slug: 'update_role' },
//   { name: 'delete role', slug: 'delete_role' },
//   { name: 'create permission', slug: 'create_permission' },
//   { name: 'read permission', slug: 'read_permission' },
//   { name: 'update permission', slug: 'update_permission' },
//   { name: 'delete permission', slug: 'delete_permission' },
//   { name: 'create post', slug: 'create_post' },
//   { name: 'read post', slug: 'read_post' },
//   { name: 'update post', slug: 'update_post' },
//   { name: 'delete post', slug: 'delete_post' },
//   { name: 'publish post', slug: 'publish_post' },
//   { name: 'create category', slug: 'create_category' },
//   { name: 'read category', slug: 'read_category' },
//   { name: 'update category', slug: 'update_category' },
//   { name: 'delete category', slug: 'delete_category' },
//   { name: 'create comment', slug: 'create_comment' },
//   { name: 'read comment', slug: 'read_comment' },
//   { name: 'update comment', slug: 'update_comment' },
//   { name: 'delete comment', slug: 'delete_comment' },
//   { name: 'moderate comment', slug: 'moderate_comment' },
//   { name: 'upload media', slug: 'upload_media' },
//   { name: 'read media', slug: 'read_media' },
//   { name: 'update media', slug: 'update_media' },
//   { name: 'delete media', slug: 'delete_media' },
//   { name: 'view dashboard', slug: 'view_dashboard' },
//   { name: 'view analytics', slug: 'view_analytics' },
//   { name: 'manage settings', slug: 'manage_settings' },
//   { name: 'view audit_logs', slug: 'view_audit_logs' },
//   { name: 'manage reports', slug: 'manage_reports' },
// ];

//     // Insert new permissions, ignoring conflicts
//     await permissionRepo
//       .createQueryBuilder()
//       .insert()
//       .into(Permission)
//       .values(newPermissions)
//       .orIgnore()
//       .execute();
      
//     console.log('New permissions added successfully.');

//     // Create roles
//     let superAdminRole = await roleRepo.findOne({ where: { slug: 'super_admin' } });
//     if (!superAdminRole) {
//       superAdminRole = await roleRepo.save({ name: 'Super Admin', slug: 'super_admin' });
//     }

//     let userRole = await roleRepo.findOne({ where: { slug: 'user' } });
//     if (!userRole) {
//       userRole = await roleRepo.save({ name: 'user', slug: 'user' });
//       console.log('User role created');
//     } else {
//       console.log('User role already exists');
//     }

//     // Assign ALL permissions to Super Admin
//     const allPermissions = await permissionRepo.find();
//     const existingRolePermissions = await rolePermissionRepo.find({
//       where: { role_id: superAdminRole.id },
//     });
//     const existingPermissionIds = existingRolePermissions.map(rp => rp.permission_id);

//     const newRolePermissions = allPermissions
//       .filter(p => !existingPermissionIds.includes(p.id))
//       .map(p => ({ role_id: superAdminRole.id, permission_id: p.id }));

//     if (newRolePermissions.length > 0) {
//       await rolePermissionRepo.save(newRolePermissions);
//       console.log(`Assigned ${newRolePermissions.length} permissions to Super Admin`);
//     }

//     // Create admin user
//     const adminEmail = 'admin@example.com';
//     const adminExists = await userRepo.findOne({ where: { email: adminEmail } });

//     if (!adminExists) {
//       const hashedPassword = await bcrypt.hash('admin123', 10);
//       await userRepo.save({
//         username: 'admin',
//         email: adminEmail,
//         password: hashedPassword,
//         role: RoleEnum.SUPER_ADMIN,
//         role_id: superAdminRole.id,
//         status: UserStatus.ACTIVE,
//       });
//       console.log('Admin created: admin@example.com / admin123');
//     }
//   } catch (error) {
//     console.error('Seed error:', error);
//     process.exit(1);
//   } finally {
//     if (dataSource.isInitialized) {
//       await dataSource.destroy();
//     }
//   }
// }

// if (require.main === module) {
//   seed();
// }

import * as dotenv from 'dotenv';
dotenv.config();
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User, UserStatus } from '../../modules/users/entities/user.entity';
import { Role } from '../../modules/roles/entities/role.entity';
import { Permission } from '../../modules/permissions/entities/permission.entity';
import { RolePermission } from '../../modules/role-permissions/entities/role-permission.entity';
import { Role as RoleEnum } from '../../common/enums/role.enum';
import { dataSourceOptions } from '../../config/database.config';

const dataSource = new DataSource(dataSourceOptions);

async function seed() {
    try {
        await dataSource.initialize();
        const userRepo = dataSource.getRepository(User);
        const roleRepo = dataSource.getRepository(Role);
        const permissionRepo = dataSource.getRepository(Permission);
        const rolePermissionRepo = dataSource.getRepository(RolePermission);

        // New permissions to be added (this list is from your original file)
        const newPermissions = [
            { name: 'Auth Register', slug: 'auth_register' },
            { name: 'Auth Login', slug: 'auth_login' },
            { name: 'Auth Refresh', slug: 'auth_refresh' },
            { name: 'Auth Logout', slug: 'auth_logout' },
            { name: 'Auth Forgot Password', slug: 'auth_forgot_password' },
            { name: 'Auth Reset Password', slug: 'auth_reset_password' },
            { name: 'Users Create', slug: 'users_create' },
            { name: 'Users List', slug: 'users_list' },
            { name: 'Users Show', slug: 'users_show' },
            { name: 'Users Update', slug: 'users_update' },
            { name: 'Users Delete', slug: 'users_delete' },
            { name: 'Users Profile', slug: 'users_profile' },
            { name: 'Users Posts', slug: 'users_posts' },
            { name: 'Users Drafts', slug: 'users_drafts' },
            { name: 'Users Bookmarks', slug: 'users_bookmarks' },
            { name: 'Users Followers', slug: 'users_followers' },
            { name: 'Users Following', slug: 'users_following' },
            { name: 'Users Notifications', slug: 'users_notifications' },
            { name: 'Roles Create', slug: 'roles_create' },
            { name: 'Roles List', slug: 'roles_list' },
            { name: 'Roles Show', slug: 'roles_show' },
            { name: 'Roles Update', slug: 'roles_update' },
            { name: 'Roles Delete', slug: 'roles_delete' },
            { name: 'Roles Permissions', slug: 'roles_permissions' },
            { name: 'Roles Users', slug: 'roles_users' },
            { name: 'Permissions Create', slug: 'permissions_create' },
            { name: 'Permissions List', slug: 'permissions_list' },
            { name: 'Permissions Show', slug: 'permissions_show' },
            { name: 'Permissions Update', slug: 'permissions_update' },
            { name: 'Permissions Delete', slug: 'permissions_delete' },
            { name: 'Permissions Roles', slug: 'permissions_roles' },
            { name: 'Posts Create', slug: 'posts_create' },
            { name: 'Posts List', slug: 'posts_list' },
            { name: 'Posts Show', slug: 'posts_show' },
            { name: 'Posts Update', slug: 'posts_update' },
            { name: 'Posts Delete', slug: 'posts_delete' },
            { name: 'Posts Comments', slug: 'posts_comments' },
            { name: 'Posts Media', slug: 'posts_media' },
            { name: 'Posts Tags', slug: 'posts_tags' },
            { name: 'Posts Reactions', slug: 'posts_reactions' },
            { name: 'Categories Create', slug: 'categories_create' },
            { name: 'Categories List', slug: 'categories_list' },
            { name: 'Categories Show', slug: 'categories_show' },
            { name: 'Categories Update', slug: 'categories_update' },
            { name: 'Categories Delete', slug: 'categories_delete' },
            { name: 'Categories Posts', slug: 'categories_posts' },
            { name: 'Categories Followers', slug: 'categories_followers' },
            { name: 'Comments Create', slug: 'comments_create' },
            { name: 'Comments List', slug: 'comments_list' },
            { name: 'Comments Show', slug: 'comments_show' },
            { name: 'Comments Update', slug: 'comments_update' },
            { name: 'Comments Delete', slug: 'comments_delete' },
            { name: 'Comments Replies', slug: 'comments_replies' },
            { name: 'Media Create', slug: 'media_create' },
            { name: 'Media List', slug: 'media_list' },
            { name: 'Media Show', slug: 'media_show' },
            { name: 'Media Update', slug: 'media_update' },
            { name: 'Media Delete', slug: 'media_delete' },
            { name: 'Media By User', slug: 'media_by_user' },
            { name: 'Answers Create', slug: 'answers_create' },
            { name: 'Answers List', slug: 'answers_list' },
            { name: 'Answers Show', slug: 'answers_show' },
            { name: 'Answers Update', slug: 'answers_update' },
            { name: 'Answers Delete', slug: 'answers_delete' },
            { name: 'Audit Logs List', slug: 'audit_logs_list' },
            { name: 'Audit Logs Show', slug: 'audit_logs_show' },
            { name: 'Author Followers Create', slug: 'author_followers_create' },
            { name: 'Author Followers List', slug: 'author_followers_list' },
            { name: 'Author Followers Delete', slug: 'author_followers_delete' },
            { name: 'Bookmarks Create', slug: 'bookmarks_create' },
            { name: 'Bookmarks List', slug: 'bookmarks_list' },
            { name: 'Bookmarks Delete', slug: 'bookmarks_delete' },
            { name: 'Category Followers Create', slug: 'category_followers_create' },
            { name: 'Category Followers List', slug: 'category_followers_list' },
            { name: 'Category Followers Delete', slug: 'category_followers_delete' },
            { name: 'Comment Replies Create', slug: 'comment_replies_create' },
            { name: 'Comment Replies List', slug: 'comment_replies_list' },
            { name: 'Comment Replies Show', slug: 'comment_replies_show' },
            { name: 'Comment Replies Update', slug: 'comment_replies_update' },
            { name: 'Comment Replies Delete', slug: 'comment_replies_delete' },
            { name: 'Drafts Create', slug: 'drafts_create' },
            { name: 'Drafts List', slug: 'drafts_list' },
            { name: 'Drafts Show', slug: 'drafts_show' },
            { name: 'Drafts Update', slug: 'drafts_update' },
            { name: 'Drafts Delete', slug: 'drafts_delete' },
            { name: 'Followers Create', slug: 'followers_create' },
            { name: 'Followers List', slug: 'followers_list' },
            { name: 'Followers Delete', slug: 'followers_delete' },
            { name: 'Notifications Create', slug: 'notifications_create' },
            { name: 'Notifications List', slug: 'notifications_list' },
            { name: 'Notifications Show', slug: 'notifications_show' },
            { name: 'Notifications Update', slug: 'notifications_update' },
            { name: 'Notifications Delete', slug: 'notifications_delete' },
            { name: 'Post Media Create', slug: 'post_media_create' },
            { name: 'Post Media List', slug: 'post_media_list' },
            { name: 'Post Media Delete', slug: 'post_media_delete' },
            { name: 'Post Tags Create', slug: 'post_tags_create' },
            { name: 'Post Tags List', slug: 'post_tags_list' },
            { name: 'Post Tags Delete', slug: 'post_tags_delete' },
            { name: 'Questions Create', slug: 'questions_create' },
            { name: 'Questions List', slug: 'questions_list' },
            { name: 'Questions Show', slug: 'questions_show' },
            { name: 'Questions Update', slug: 'questions_update' },
            { name: 'Questions Delete', slug: 'questions_delete' },
            { name: 'Reactions Create', slug: 'reactions_create' },
            { name: 'Reactions List', slug: 'reactions_list' },
            { name: 'Reactions Show', slug: 'reactions_show' },
            { name: 'Reactions Update', slug: 'reactions_update' },
            { name: 'Reactions Delete', slug: 'reactions_delete' },
            { name: 'Recommendations List', slug: 'recommendations_list' },
            { name: 'Recommendations Show', slug: 'recommendations_show' },
            { name: 'Reports Create', slug: 'reports_create' },
            { name: 'Reports List', slug: 'reports_list' },
            { name: 'Reports Show', slug: 'reports_show' },
            { name: 'Reports Update', slug: 'reports_update' },
            { name: 'Reports Delete', slug: 'reports_delete' },
            { name: 'Role Permissions Create', slug: 'role_permissions_create' },
            { name: 'Role Permissions List', slug: 'role_permissions_list' },
            { name: 'Role Permissions Delete', slug: 'role_permissions_delete' },
            { name: 'Tags Create', slug: 'tags_create' },
            { name: 'Tags List', slug: 'tags_list' },
            { name: 'Tags Show', slug: 'tags_show' },
            { name: 'Tags Update', slug: 'tags_update' },
            { name: 'Tags Delete', slug: 'tags_delete' },
            { name: 'Tracking Create', slug: 'tracking_create' },
            { name: 'Tracking List', slug: 'tracking_list' },
            { name: 'Tracking Show', slug: 'tracking_show' },
            { name: 'Views Create', slug: 'views_create' },
            { name: 'Views List', slug: 'views_list' },
            { name: 'Views Show', slug: 'views_show' },
            { name: 'create user', slug: 'create_user' },
            { name: 'read user', slug: 'read_user' },
            { name: 'update user', slug: 'update_user' },
            { name: 'delete user', slug: 'delete_user' },
            { name: 'create role', slug: 'create_role' },
            { name: 'read role', slug: 'read_role' },
            { name: 'update role', slug: 'update_role' },
            { name: 'delete role', slug: 'delete_role' },
            { name: 'create permission', slug: 'create_permission' },
            { name: 'read permission', slug: 'read_permission' },
            { name: 'update permission', slug: 'update_permission' },
            { name: 'delete permission', slug: 'delete_permission' },
            { name: 'create post', slug: 'create_post' },
            { name: 'read post', slug: 'read_post' },
            { name: 'update post', slug: 'update_post' },
            { name: 'delete post', slug: 'delete_post' },
            { name: 'publish post', slug: 'publish_post' },
            { name: 'create category', slug: 'create_category' },
            { name: 'read category', slug: 'read_category' },
            { name: 'update category', slug: 'update_category' },
            { name: 'delete category', slug: 'delete_category' },
            { name: 'create comment', slug: 'create_comment' },
            { name: 'read comment', slug: 'read_comment' },
            { name: 'update comment', slug: 'update_comment' },
            { name: 'delete comment', slug: 'delete_comment' },
            { name: 'moderate comment', slug: 'moderate_comment' },
            { name: 'upload media', slug: 'upload_media' },
            { name: 'read media', slug: 'read_media' },
            { name: 'update media', slug: 'update_media' },
            { name: 'delete media', slug: 'delete_media' },
            { name: 'view dashboard', slug: 'view_dashboard' },
            { name: 'view analytics', slug: 'view_analytics' },
            { name: 'manage settings', slug: 'manage_settings' },
            { name: 'view audit_logs', slug: 'view_audit_logs' },
            { name: 'manage reports', slug: 'manage_reports' },
        ];

        // Insert new permissions, ignoring conflicts
        await permissionRepo
            .createQueryBuilder()
            .insert()
            .into(Permission)
            .values(newPermissions)
            .orIgnore()
            .execute();

        console.log('New permissions added successfully.');

        // Create roles
        let superAdminRole = await roleRepo.findOne({ where: { slug: 'super_admin' } });
        if (!superAdminRole) {
            superAdminRole = await roleRepo.save({ name: 'Super Admin', slug: 'super_admin' });
        }

        let userRole = await roleRepo.findOne({ where: { slug: 'user' } });
        if (!userRole) {
            userRole = await roleRepo.save({ name: 'user', slug: 'user' });
            console.log('User role created');
        } else {
            console.log('User role already exists');
        }

        // Assign ALL permissions to Super Admin
        const allPermissions = await permissionRepo.find();
        const existingSuperAdminRolePermissions = await rolePermissionRepo.find({
            where: { role_id: superAdminRole.id },
        });
        const existingSuperAdminPermissionIds = existingSuperAdminRolePermissions.map(rp => rp.permission_id);

        const newSuperAdminRolePermissions = allPermissions
            .filter(p => !existingSuperAdminPermissionIds.includes(p.id))
            .map(p => ({ role_id: superAdminRole.id, permission_id: p.id }));

        if (newSuperAdminRolePermissions.length > 0) {
            await rolePermissionRepo.save(newSuperAdminRolePermissions);
            console.log(`Assigned ${newSuperAdminRolePermissions.length} permissions to Super Admin`);
        }

        // --- New Section: Assign Permissions to the 'user' role ---

        // Define the slugs for the permissions to be assigned to the 'user' role
        const userPermissionSlugs = [
            // Authentication
            'auth_register', 'auth_login', 'auth_refresh', 'auth_logout', 'auth_forgot_password', 'auth_reset_password',
            // Users
            'users_show', 'users_profile', 'users_posts', 'users_drafts', 'users_bookmarks', 'users_followers', 'users_following', 'users_notifications',
            // Posts
            'posts_list', 'posts_show', 'posts_comments', 'posts_media', 'posts_tags', 'posts_reactions', 'posts_create', 'posts_update', 'posts_delete',
            // Comments & Replies
            'comments_create', 'comments_list', 'comments_show', 'comments_update', 'comments_delete', 'comments_replies', 'comment_replies_create', 'comment_replies_list', 'comment_replies_show', 'comment_replies_update', 'comment_replies_delete',
            // Bookmarks
            'bookmarks_create', 'bookmarks_list', 'bookmarks_delete',
            // Reactions
            'reactions_create', 'reactions_list', 'reactions_show', 'reactions_update', 'reactions_delete',
            // Tags & Categories
            'tags_list', 'categories_list', 'categories_followers', 'category_followers_create', 'category_followers_list', 'category_followers_delete',
            // Media
            'media_create', 'media_list', 'media_show', 'media_by_user', 'media_delete',
            // Drafts
            'drafts_create', 'drafts_list', 'drafts_show', 'drafts_update', 'drafts_delete',
            // Notifications
            'notifications_list', 'notifications_show', 'notifications_update', 'notifications_delete',
            // Q&A
            'questions_create', 'questions_list', 'questions_show', 'questions_update', 'questions_delete', 'answers_create', 'answers_list', 'answers_show', 'answers_update', 'answers_delete',
            // Followers
            'author_followers_create', 'author_followers_list', 'author_followers_delete',
            // Views / Recommendations
            'views_create', 'views_list', 'views_show', 'recommendations_list', 'recommendations_show'
        ];

        // Find the permission entities for the 'user' role
        const userPermissions = await permissionRepo
            .createQueryBuilder()
            .where('slug IN (:...slugs)', { slugs: userPermissionSlugs })
            .getMany();

        // Get existing permissions for the 'user' role to prevent duplicates
        const existingUserRolePermissions = await rolePermissionRepo.find({
            where: { role_id: userRole.id },
        });
        const existingUserPermissionIds = existingUserRolePermissions.map(rp => rp.permission_id);

        // Create new role-permission relationships for the 'user' role
        const newUserRolePermissions = userPermissions
            .filter(p => !existingUserPermissionIds.includes(p.id))
            .map(p => ({ role_id: userRole.id, permission_id: p.id }));

        // Save the new relationships
        if (newUserRolePermissions.length > 0) {
            await rolePermissionRepo.save(newUserRolePermissions);
            console.log(`Assigned ${newUserRolePermissions.length} permissions to the 'user' role.`);
        } else {
            console.log('User role already has all specified permissions.');
        }

        // --- End of New Section ---

        // Create admin user
        const adminEmail = 'admin@example.com';
        const adminExists = await userRepo.findOne({ where: { email: adminEmail } });

        if (!adminExists) {
            const hashedPassword = await bcrypt.hash('admin123', 10);
            await userRepo.save({
                username: 'admin',
                email: adminEmail,
                password: hashedPassword,
                role: RoleEnum.SUPER_ADMIN,
                role_id: superAdminRole.id,
                status: UserStatus.ACTIVE,
            });
            console.log('Admin created: admin@example.com / admin123');
        }
    } catch (error) {
        console.error('Seed error:', error);
        process.exit(1);
    } finally {
        if (dataSource.isInitialized) {
            await dataSource.destroy();
        }
    }
}

if (require.main === module) {
    seed();
}