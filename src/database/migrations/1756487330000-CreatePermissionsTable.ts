import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreatePermissionsTable1756487330000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: "permissions",
      columns: [
        {name: 'id',type: 'uuid',isPrimary: true,default: 'gen_random_uuid()'},
        { name: "name", type: "varchar", isUnique: true, isNullable: false },
        { name: "slug", type: "varchar", isUnique: true, isNullable: false },
        { name: "created_at", type: "timestamp", default: "CURRENT_TIMESTAMP" },
        { name: "updated_at", type: "timestamp", default: "CURRENT_TIMESTAMP" },
      ]
    }), true);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("permissions");
  }
}
