import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddPercentageToUsers1713425600000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "users",
      new TableColumn({
        name: "percentage",
        type: "numeric",
        precision: 5,
        scale: 2,
        isNullable: true,
        default: 0,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("users", "percentage");
  }
}
