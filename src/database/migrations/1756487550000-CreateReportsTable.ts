import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateReportsTable1756487550000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'reports',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          { name: 'reporter_id', type: 'uuid', isNullable: false },
          { name: 'reportable_type', type: 'varchar', isNullable: false },
          { name: 'reportable_id', type: 'uuid', isNullable: false },
          { name: 'reason', type: 'varchar', isNullable: false },
          { name: 'description', type: 'text', isNullable: false },
          { name: 'status', type: 'varchar', isNullable: false },
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
            columnNames: ['reporter_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
      true,
    );

    await queryRunner.query(
      'CREATE INDEX "IDX_reports_reporter_id" ON "reports" ("reporter_id")',
    );
    await queryRunner.query(
      'CREATE INDEX "IDX_reports_reportable" ON "reports" ("reportable_type", "reportable_id")',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX "IDX_reports_reportable"');
    await queryRunner.query('DROP INDEX "IDX_reports_reporter_id"');
    await queryRunner.dropTable('reports');
  }
}
