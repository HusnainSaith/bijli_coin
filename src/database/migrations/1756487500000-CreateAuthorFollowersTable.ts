import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateAuthorFollowersTable1756487500000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'author_followers',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          { name: 'follower_id', type: 'uuid', isNullable: false },
          { name: 'author_id', type: 'uuid', isNullable: false },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
        foreignKeys: [
          {
            columnNames: ['follower_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
          {
            columnNames: ['author_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
      true,
    );

    await queryRunner.query(
      'CREATE INDEX "IDX_author_followers_follower_id" ON "author_followers" ("follower_id")',
    );
    await queryRunner.query(
      'CREATE INDEX "IDX_author_followers_author_id" ON "author_followers" ("author_id")',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX "IDX_author_followers_author_id"');
    await queryRunner.query('DROP INDEX "IDX_author_followers_follower_id"');
    await queryRunner.dropTable('author_followers');
  }
}
