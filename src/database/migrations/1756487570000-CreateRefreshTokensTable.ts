import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateRefreshTokensTable1756487570000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'refresh_tokens',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          { name: 'token', type: 'varchar', isNullable: false },
          { name: 'user_id', type: 'uuid', isNullable: false },
          { name: 'expires_at', type: 'timestamp', isNullable: false },
          { name: 'is_revoked', type: 'boolean', default: false },
          {
            name: 'created_at',
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
        ],
      }),
      true,
    );

    await queryRunner.query(
      'CREATE INDEX "IDX_refresh_tokens_user_id" ON "refresh_tokens" ("user_id")',
    );
    await queryRunner.query(
      'CREATE INDEX "IDX_refresh_tokens_token" ON "refresh_tokens" ("token")',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX "IDX_refresh_tokens_token"');
    await queryRunner.query('DROP INDEX "IDX_refresh_tokens_user_id"');
    await queryRunner.dropTable('refresh_tokens');
  }
}
