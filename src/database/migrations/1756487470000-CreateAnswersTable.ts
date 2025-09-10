import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateAnswersTable1756487470000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: "answers",
      columns: [
        {name: 'id',type: 'uuid',isPrimary: true,default: 'gen_random_uuid()'},
        { name: "question_id", type: "uuid", isNullable: false },
        { name: "user_id", type: "uuid", isNullable: false },
        { name: "content", type: "text", isNullable: false },
        { name: "is_accepted", type: "boolean", default: false },
        { name: "votes_count", type: "int", default: 0 },
        { name: "created_at", type: "timestamp", default: "CURRENT_TIMESTAMP" },
        { name: "updated_at", type: "timestamp", default: "CURRENT_TIMESTAMP" }
      ],
      foreignKeys: [
        { columnNames: ["question_id"], referencedTableName: "questions", referencedColumnNames: ["id"], onDelete: "CASCADE" },
        { columnNames: ["user_id"], referencedTableName: "users", referencedColumnNames: ["id"], onDelete: "CASCADE" }
      ]
    }), true);

    await queryRunner.query('CREATE INDEX "IDX_answers_question_id" ON "answers" ("question_id")');
    await queryRunner.query('CREATE INDEX "IDX_answers_user_id" ON "answers" ("user_id")');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX "IDX_answers_user_id"');
    await queryRunner.query('DROP INDEX "IDX_answers_question_id"');
    await queryRunner.dropTable("answers");
  }
}
