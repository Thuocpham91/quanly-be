import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddFieldsToMonthlyPayout1730000000000 implements MigrationInterface {
    name = 'AddFieldsToMonthlyPayout1730000000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            "MONTHLY_PAYOUT",
            new TableColumn({
                name: "totalQuantity",
                type: "numeric",
                precision: 20,
                scale: 2,
                isNullable: false,
                default: 0,
            }),
        );
        await queryRunner.addColumn(
            "MONTHLY_PAYOUT",
            new TableColumn({
                name: "percentage",
                type: "numeric",
                precision: 5,
                scale: 2,
                isNullable: false,
                default: 0,
            }),
        );
        await queryRunner.addColumn(
            "MONTHLY_PAYOUT",
            new TableColumn({
                name: "actualRevenue",
                type: "numeric",
                precision: 20,
                scale: 2,
                isNullable: false,
                default: 0,
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("MONTHLY_PAYOUT", "actualRevenue");
        await queryRunner.dropColumn("MONTHLY_PAYOUT", "percentage");
        await queryRunner.dropColumn("MONTHLY_PAYOUT", "totalQuantity");
    }
}
