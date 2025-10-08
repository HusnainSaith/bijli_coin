import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateQuestionsTable1756487460000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'questions',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          { name: 'user_id', type: 'uuid', isNullable: false },
          { name: 'title', type: 'varchar', isNullable: false },
          { name: 'slug', type: 'varchar', isUnique: true, isNullable: false },
          { name: 'content', type: 'text', isNullable: false },
          { name: 'category_id', type: 'uuid', isNullable: false },
          {
            name: 'status',
            type: 'enum',
            enum: ['open', 'closed', 'archived'],
            isNullable: true,
          },
          { name: 'views_count', type: 'int', default: 0 },
          { name: 'answers_count', type: 'int', default: 0 },
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
      'CREATE INDEX "IDX_questions_user_id" ON "questions" ("user_id")',
    );
    await queryRunner.query(
      'CREATE INDEX "IDX_questions_category_id" ON "questions" ("category_id")',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX "IDX_questions_category_id"');
    await queryRunner.query('DROP INDEX "IDX_questions_user_id"');
    await queryRunner.dropTable('questions');
  }
}
