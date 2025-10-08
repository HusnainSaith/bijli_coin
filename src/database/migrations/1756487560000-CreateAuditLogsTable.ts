import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateAuditLogsTable1756487560000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'audit_logs',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          { name: 'user_id', type: 'uuid', isNullable: true },
          { name: 'action', type: 'varchar', isNullable: false },
          { name: 'auditable_type', type: 'varchar', isNullable: true },
          { name: 'auditable_id', type: 'uuid', isNullable: true },
          { name: 'ip_address', type: 'varchar', isNullable: true },
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
            onDelete: 'SET NULL',
          },
        ],
      }),
      true,
    );

    await queryRunner.query(
      'CREATE INDEX "IDX_audit_logs_user_id" ON "audit_logs" ("user_id")',
    );
    await queryRunner.query(
      'CREATE INDEX "IDX_audit_logs_auditable" ON "audit_logs" ("auditable_type", "auditable_id")',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX "IDX_audit_logs_auditable"');
    await queryRunner.query('DROP INDEX "IDX_audit_logs_user_id"');
    await queryRunner.dropTable('audit_logs');
  }
}
