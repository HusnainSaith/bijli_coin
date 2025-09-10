import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreatePostTagsTable1756487450000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: "post_tags",
      columns: [
        {name: 'id',type: 'uuid',isPrimary: true,default: 'gen_random_uuid()'},
        { name: "post_id", type: "uuid", isNullable: false },
        { name: "tag_id", type: "uuid", isNullable: false },
        { name: "created_at", type: "timestamp", default: "CURRENT_TIMESTAMP" }
      ],
      foreignKeys: [
        { columnNames: ["post_id"], referencedTableName: "posts", referencedColumnNames: ["id"], onDelete: "CASCADE" },
        { columnNames: ["tag_id"], referencedTableName: "tags", referencedColumnNames: ["id"], onDelete: "CASCADE" }
      ]
    }), true);

    await queryRunner.query('CREATE INDEX "IDX_post_tags_post_id" ON "post_tags" ("post_id")');
    await queryRunner.query('CREATE INDEX "IDX_post_tags_tag_id" ON "post_tags" ("tag_id")');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX "IDX_post_tags_tag_id"');
    await queryRunner.query('DROP INDEX "IDX_post_tags_post_id"');
    await queryRunner.dropTable("post_tags");
  }
}
