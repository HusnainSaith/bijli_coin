import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateCategoriesTable1756487350000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: "categories",
      columns: [
        {name: 'id',type: 'uuid',isPrimary: true,default: 'gen_random_uuid()'},
        { name: "name", type: "varchar", isNullable: false },
        { name: "slug", type: "varchar", isUnique: true, isNullable: false },
        { name: "parent_id", type: "uuid", isNullable: true },
        { name: "posts_count", type: "int", default: 0 },
        { name: "followers_count", type: "int", default: 0 },
        { name: "is_active", type: "boolean", default: true },
        { name: "created_at", type: "timestamp", default: "CURRENT_TIMESTAMP" },
        { name: "updated_at", type: "timestamp", default: "CURRENT_TIMESTAMP" },
      ],
      foreignKeys: [
        { columnNames: ["parent_id"], referencedTableName: "categories", referencedColumnNames: ["id"], onDelete: "SET NULL" }
      ]
    }), true);

    await queryRunner.query('CREATE INDEX "IDX_categories_parent_id" ON "categories" ("parent_id")');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX "IDX_categories_parent_id"');
    await queryRunner.dropTable("categories");
  }
}
