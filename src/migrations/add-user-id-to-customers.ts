import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserIdToCustomers1735315200000 implements MigrationInterface {
    name = 'AddUserIdToCustomers1735315200000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customers" ADD "userId" bigint NOT NULL`);
        await queryRunner.query(`ALTER TABLE "customers" ADD CONSTRAINT "FK_customers_userId" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`CREATE INDEX "IDX_customers_userId" ON "customers" ("userId")`);
        await queryRunner.query(`ALTER TABLE "customers" ADD "isSelfCustomer" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN "isSelfCustomer"`);
        await queryRunner.query(`DROP INDEX "IDX_customers_userId"`);
        await queryRunner.query(`ALTER TABLE "customers" DROP CONSTRAINT "FK_customers_userId"`);
        await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN "userId"`);
    }

}