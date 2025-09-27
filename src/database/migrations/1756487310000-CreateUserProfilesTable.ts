import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateUserProfilesTable1756487310000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: "user_profiles",
      columns: [
        { name: 'id', type: 'uuid', isPrimary: true, default: 'gen_random_uuid()' },
        { name: "user_id", type: "uuid", isNullable: false },
        { name: "first_name", type: "varchar", isNullable: true },
        { name: "last_name", type: "varchar", isNullable: true },
        { name: "bio", type: "text", isNullable: true },
        { name: "avatar", type: "varchar", isNullable: true },
        { name: "profile_picture", type: "varchar", isNullable: true }, // Added this line
        { name: "phone", type: "varchar", isNullable: true },
        { name: "location", type: "varchar", isNullable: true },
        { name: "website_url", type: "varchar", isNullable: true },
        { name: "company", type: "varchar", isNullable: true },
        { name: "job_title", type: "varchar", isNullable: true },
        { name: "posts_count", type: "int", default: 0 },
        { name: "followers_count", type: "int", default: 0 },
        { name: "following_count", type: "int", default: 0 },
        { name: "created_at", type: "timestamp", default: "CURRENT_TIMESTAMP" },
        { name: "updated_at", type: "timestamp", default: "CURRENT_TIMESTAMP" },
      ],
      foreignKeys: [
        { columnNames: ["user_id"], referencedTableName: "users", referencedColumnNames: ["id"], onDelete: "CASCADE" }
      ]
    }), true);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("user_profiles");
  }
}