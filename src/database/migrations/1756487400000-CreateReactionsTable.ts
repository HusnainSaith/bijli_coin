import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateReactionsTable1756487400000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: "reactions",
      columns: [
        {name: 'id',type: 'uuid',isPrimary: true,default: 'gen_random_uuid()'},
        { name: "user_id", type: "uuid", isNullable: false },
        { name: "reactable_type", type: "varchar", isNullable: false },
        { name: "reactable_id", type: "uuid", isNullable: false },
        { name: "type", type: "enum", enum: ["like", "love", "haha", "wow", "sad", "angry"], isNullable: true },
        { name: "created_at", type: "timestamp", default: "CURRENT_TIMESTAMP" }
      ],
      foreignKeys: [
        { columnNames: ["user_id"], referencedTableName: "users", referencedColumnNames: ["id"], onDelete: "CASCADE" }
      ]
    }), true);

    await queryRunner.query('CREATE INDEX "IDX_reactions_user_id" ON "reactions" ("user_id")');
    await queryRunner.query('CREATE INDEX "IDX_reactions_reactable" ON "reactions" ("reactable_type", "reactable_id")');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX "IDX_reactions_reactable"');
    await queryRunner.query('DROP INDEX "IDX_reactions_user_id"');
    await queryRunner.dropTable("reactions");
  }
}

