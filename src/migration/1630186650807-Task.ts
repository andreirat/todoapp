import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey } from "typeorm";

export class Task1630186650807 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: "tasks",
      columns: [
        {
          name: "id",
          type: "int",
          isPrimary: true
        },
        {
          name: "taskName",
          type: "text",
        },
        {
          name: "isCompleted",
          type: "boolean",
          default: false
        }
      ]
    }), true);

    await queryRunner.addColumn("tasks", new TableColumn({
      name: "userId",
      type: "int",
      isNullable: false
    }));

    await queryRunner.createForeignKey("tasks", new TableForeignKey({
      columnNames: ["userId"],
      referencedColumnNames: ["id"],
      referencedTableName: "users",
      onDelete: "CASCADE"
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable("tasks");
    // @ts-ignore
    const foreignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf("userId") !== -1);
    // @ts-ignore
    await queryRunner.dropForeignKey("tasks", foreignKey);
    await queryRunner.dropColumn("tasks", "userId");
    await queryRunner.dropTable("tasks");
  }

}
