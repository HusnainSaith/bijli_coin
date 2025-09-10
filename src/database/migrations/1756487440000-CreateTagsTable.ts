import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateTagsTable1756487440000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: "tags",
      columns: [
        {name: 'id',type: 'uuid',isPrimary: true,default: 'gen_random_uuid()'},
        { name: "name", type: "varchar", isUnique: true, isNullable: false },
        { name: "slug", type: "varchar", isUnique: true, isNullable: false },
        { name: "posts_count", type: "int", default: 0 },
        { name: "created_at", type: "timestamp", default: "CURRENT_TIMESTAMP" },
        { name: "updated_at", type: "timestamp", default: "CURRENT_TIMESTAMP" }
      ]
    }), true);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("tags");
  }
}
