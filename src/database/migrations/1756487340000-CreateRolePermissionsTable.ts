import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateRolePermissionsTable1756487340000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: "role_permissions",
      columns: [
        {name: 'id',type: 'uuid',isPrimary: true,default: 'gen_random_uuid()'},
        { name: "role_id", type: "uuid", isNullable: false },
        { name: "permission_id", type: "uuid", isNullable: false },
        { name: "created_at", type: "timestamp", default: "CURRENT_TIMESTAMP" },
      ],
      foreignKeys: [
        { columnNames: ["role_id"], referencedTableName: "roles", referencedColumnNames: ["id"], onDelete: "CASCADE" },
        { columnNames: ["permission_id"], referencedTableName: "permissions", referencedColumnNames: ["id"], onDelete: "CASCADE" }
      ]
    }), true);

    await queryRunner.query('CREATE INDEX "IDX_role_permissions_role_id" ON "role_permissions" ("role_id")');
    await queryRunner.query('CREATE INDEX "IDX_role_permissions_permission_id" ON "role_permissions" ("permission_id")');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX "IDX_role_permissions_permission_id"');
    await queryRunner.query('DROP INDEX "IDX_role_permissions_role_id"');
    await queryRunner.dropTable("role_permissions");
  }
}
