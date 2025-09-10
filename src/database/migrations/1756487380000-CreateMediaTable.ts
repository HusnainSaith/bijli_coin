import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateMediaTable1756487380000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: "media",
      columns: [
        {name: 'id',type: 'uuid',isPrimary: true,default: 'gen_random_uuid()'},
        { name: "user_id", type: "uuid", isNullable: false },
        { name: "filename", type: "varchar", isNullable: false },
        { name: "file_path", type: "varchar", isNullable: false },
        { name: "file_url", type: "varchar", isNullable: false },
        { name: "mime_type", type: "varchar", isNullable: false },
        { name: "file_size", type: "bigint", isNullable: false },
        { name: "created_at", type: "timestamp", default: "CURRENT_TIMESTAMP" },
        { name: "updated_at", type: "timestamp", default: "CURRENT_TIMESTAMP" },
      ],
      foreignKeys: [
        { columnNames: ["user_id"], referencedTableName: "users", referencedColumnNames: ["id"], onDelete: "CASCADE" }
      ]
    }), true);

    await queryRunner.query('CREATE INDEX "IDX_media_user_id" ON "media" ("user_id")');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX "IDX_media_user_id"');
    await queryRunner.dropTable("media");
  }
}
