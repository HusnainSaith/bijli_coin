import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateViewsTable1756487520000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: "views",
      columns: [
        {name: 'id',type: 'uuid',isPrimary: true,default: 'gen_random_uuid()'},
        { name: "user_id", type: "uuid", isNullable: true },
        { name: "viewable_type", type: "varchar", isNullable: false },
        { name: "viewable_id", type: "uuid", isNullable: false },
        { name: "ip_address", type: "varchar", isNullable: false },
        { name: "created_at", type: "timestamp", default: "CURRENT_TIMESTAMP" }
      ],
      foreignKeys: [
        { columnNames: ["user_id"], referencedTableName: "users", referencedColumnNames: ["id"], onDelete: "SET NULL" }
      ]
    }), true);

    await queryRunner.query('CREATE INDEX "IDX_views_viewable" ON "views" ("viewable_type", "viewable_id")');
    await queryRunner.query('CREATE INDEX "IDX_views_user_id" ON "views" ("user_id")');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX "IDX_views_user_id"');
    await queryRunner.query('DROP INDEX "IDX_views_viewable"');
    await queryRunner.dropTable("views");
  }
}
