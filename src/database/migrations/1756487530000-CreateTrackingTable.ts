import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateTrackingTable1756487530000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: "tracking",
      columns: [
        {name: 'id',type: 'uuid',isPrimary: true,default: 'gen_random_uuid()'},
        { name: "user_id", type: "uuid", isNullable: true },
        { name: "event_name", type: "varchar", isNullable: false },
        { name: "event_type", type: "varchar", isNullable: false },
        { name: "ip_address", type: "varchar", isNullable: true },
        { name: "created_at", type: "timestamp", default: "CURRENT_TIMESTAMP" }
      ],
      foreignKeys: [
        { columnNames: ["user_id"], referencedTableName: "users", referencedColumnNames: ["id"], onDelete: "SET NULL" }
      ]
    }), true);

    await queryRunner.query('CREATE INDEX "IDX_tracking_user_id" ON "tracking" ("user_id")');
    await queryRunner.query('CREATE INDEX "IDX_tracking_event_type" ON "tracking" ("event_type")');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX "IDX_tracking_event_type"');
    await queryRunner.query('DROP INDEX "IDX_tracking_user_id"');
    await queryRunner.dropTable("tracking");
  }
}
