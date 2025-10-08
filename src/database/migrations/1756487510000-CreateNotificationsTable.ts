import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateNotificationsTable1756487510000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'notifications',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          { name: 'user_id', type: 'uuid', isNullable: false },
          { name: 'type', type: 'varchar', isNullable: false },
          { name: 'title', type: 'varchar', isNullable: false },
          { name: 'message', type: 'text', isNullable: false },
          { name: 'is_read', type: 'boolean', default: false },
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
      'CREATE INDEX "IDX_notifications_user_id" ON "notifications" ("user_id")',
    );
    await queryRunner.query(
      'CREATE INDEX "IDX_notifications_is_read" ON "notifications" ("is_read")',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX "IDX_notifications_is_read"');
    await queryRunner.query('DROP INDEX "IDX_notifications_user_id"');
    await queryRunner.dropTable('notifications');
  }
}
