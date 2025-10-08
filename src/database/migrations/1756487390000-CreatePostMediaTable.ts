import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreatePostMediaTable1756487390000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'post_media',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          { name: 'post_id', type: 'uuid', isNullable: false },
          { name: 'media_id', type: 'uuid', isNullable: false },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
        foreignKeys: [
          {
            columnNames: ['post_id'],
            referencedTableName: 'posts',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
          {
            columnNames: ['media_id'],
            referencedTableName: 'media',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
      true,
    );

    await queryRunner.query(
      'CREATE INDEX "IDX_post_media_post_id" ON "post_media" ("post_id")',
    );
    await queryRunner.query(
      'CREATE INDEX "IDX_post_media_media_id" ON "post_media" ("media_id")',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX "IDX_post_media_media_id"');
    await queryRunner.query('DROP INDEX "IDX_post_media_post_id"');
    await queryRunner.dropTable('post_media');
  }
}
