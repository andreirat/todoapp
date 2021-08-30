import { MigrationInterface, QueryRunner, Table, TableIndex } from "typeorm";

export class User1630184329254 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: "users",
      columns: [
        {
          name: "id",
          type: "int",
          isPrimary: true
        },
        {
          name: "name",
          type: "varchar",
          isNullable: false
        },
        {
          name: "email",
          type: "varchar",
          isNullable: false,
          isUnique: true
        },
        {
          name: "tokenVersion",
          type: "int",
          isNullable: false,
          default: 0,
          generationStrategy: "increment"
        },
        {
          name: "password",
          type: "varchar",
          isNullable: false
        }
      ]
    }), true)

    await queryRunner.createIndex("users", new TableIndex({
      name: "IDX_USER_ID",
      columnNames: ["id"]
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex("question", "IDX_USER_ID");
    await queryRunner.dropTable("users");
  }
}
