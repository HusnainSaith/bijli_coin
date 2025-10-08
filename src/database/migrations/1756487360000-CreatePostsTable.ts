import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreatePostsTable1756487360000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'posts',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          { name: 'title', type: 'varchar', isNullable: false },
          { name: 'slug', type: 'varchar', isUnique: true, isNullable: false },
          { name: 'content', type: 'text', isNullable: false },
          { name: 'user_id', type: 'uuid', isNullable: false },
          { name: 'category_id', type: 'uuid', isNullable: false },
          {
            name: 'status',
            type: 'enum',
            enum: ['draft', 'published', 'archived'],
            isNullable: true,
          },
          { name: 'featured_image', type: 'varchar', isNullable: true },
          { name: 'views_count', type: 'int', default: 0 },
          { name: 'likes_count', type: 'int', default: 0 },
          { name: 'comments_count', type: 'int', default: 0 },
          { name: 'published_at', type: 'timestamp', isNullable: true },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
        foreignKeys: [
          {
            columnNames: ['user_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
          {
            columnNames: ['category_id'],
            referencedTableName: 'categories',
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
          },
        ],
      }),
      true,
    );

    await queryRunner.query(
      'CREATE INDEX "IDX_posts_user_id" ON "posts" ("user_id")',
    );
    await queryRunner.query(
      'CREATE INDEX "IDX_posts_category_id" ON "posts" ("category_id")',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX "IDX_posts_category_id"');
    await queryRunner.query('DROP INDEX "IDX_posts_user_id"');
    await queryRunner.dropTable('posts');
  }
}
