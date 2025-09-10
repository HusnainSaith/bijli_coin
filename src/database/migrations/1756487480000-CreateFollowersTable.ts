import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateFollowersTable1756487480000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: "followers",
      columns: [
        {name: 'id',type: 'uuid',isPrimary: true,default: 'gen_random_uuid()'},
        { name: "follower_id", type: "uuid", isNullable: false },
        { name: "following_type", type: "varchar", isNullable: false },
        { name: "following_id", type: "uuid", isNullable: false },
        { name: "created_at", type: "timestamp", default: "CURRENT_TIMESTAMP" }
      ],
      foreignKeys: [
        { columnNames: ["follower_id"], referencedTableName: "users", referencedColumnNames: ["id"], onDelete: "CASCADE" }
      ]
    }), true);

    await queryRunner.query('CREATE INDEX "IDX_followers_follower_id" ON "followers" ("follower_id")');
    await queryRunner.query('CREATE INDEX "IDX_followers_following" ON "followers" ("following_type", "following_id")');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX "IDX_followers_following"');
    await queryRunner.query('DROP INDEX "IDX_followers_follower_id"');
    await queryRunner.dropTable("followers");
  }
}
