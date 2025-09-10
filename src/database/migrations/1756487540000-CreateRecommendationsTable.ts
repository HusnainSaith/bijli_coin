import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateRecommendationsTable1756487540000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: "recommendations",
      columns: [
        {name: 'id',type: 'uuid',isPrimary: true,default: 'gen_random_uuid()'},
        { name: "user_id", type: "uuid", isNullable: false },
        { name: "recommendable_type", type: "varchar", isNullable: false },
        { name: "recommendable_id", type: "uuid", isNullable: false },
        { name: "score", type: "decimal", precision: 5, scale: 2, isNullable: true },
        { name: "created_at", type: "timestamp", default: "CURRENT_TIMESTAMP" }
      ],
      foreignKeys: [
        { columnNames: ["user_id"], referencedTableName: "users", referencedColumnNames: ["id"], onDelete: "CASCADE" }
      ]
    }), true);

    await queryRunner.query('CREATE INDEX "IDX_recommendations_user_id" ON "recommendations" ("user_id")');
    await queryRunner.query('CREATE INDEX "IDX_recommendations_recommendable" ON "recommendations" ("recommendable_type", "recommendable_id")');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX "IDX_recommendations_recommendable"');
    await queryRunner.query('DROP INDEX "IDX_recommendations_user_id"');
    await queryRunner.dropTable("recommendations");
  }
}
