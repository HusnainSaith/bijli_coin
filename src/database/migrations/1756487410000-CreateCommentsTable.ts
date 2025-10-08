import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateCommentsTable1756487410000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'comments',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          { name: 'user_id', type: 'uuid', isNullable: false },
          { name: 'post_id', type: 'uuid', isNullable: false },
          { name: 'parent_id', type: 'uuid', isNullable: true },
          { name: 'content', type: 'text', isNullable: false },
          { name: 'likes_count', type: 'int', default: 0 },
          { name: 'replies_count', type: 'int', default: 0 },
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
            columnNames: ['post_id'],
            referencedTableName: 'posts',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
          {
            columnNames: ['parent_id'],
            referencedTableName: 'comments',
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
          },
        ],
      }),
      true,
    );

    await queryRunner.query(
      'CREATE INDEX "IDX_comments_post_id" ON "comments" ("post_id")',
    );
    await queryRunner.query(
      'CREATE INDEX "IDX_comments_user_id" ON "comments" ("user_id")',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX "IDX_comments_user_id"');
    await queryRunner.query('DROP INDEX "IDX_comments_post_id"');
    await queryRunner.dropTable('comments');
  }
}
