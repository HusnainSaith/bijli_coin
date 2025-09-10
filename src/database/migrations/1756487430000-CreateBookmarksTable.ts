import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateBookmarksTable1756487430000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: "bookmarks",
      columns: [
        {name: 'id',type: 'uuid',isPrimary: true,default: 'gen_random_uuid()'},
        { name: "user_id", type: "uuid", isNullable: false },
        { name: "post_id", type: "uuid", isNullable: false },
        { name: "created_at", type: "timestamp", default: "CURRENT_TIMESTAMP" }
      ],
      foreignKeys: [
        { columnNames: ["user_id"], referencedTableName: "users", referencedColumnNames: ["id"], onDelete: "CASCADE" },
        { columnNames: ["post_id"], referencedTableName: "posts", referencedColumnNames: ["id"], onDelete: "CASCADE" }
      ]
    }), true);

    await queryRunner.query('CREATE INDEX "IDX_bookmarks_user_id" ON "bookmarks" ("user_id")');
    await queryRunner.query('CREATE INDEX "IDX_bookmarks_post_id" ON "bookmarks" ("post_id")');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX "IDX_bookmarks_post_id"');
    await queryRunner.query('DROP INDEX "IDX_bookmarks_user_id"');
    await queryRunner.dropTable("bookmarks");
  }
}
