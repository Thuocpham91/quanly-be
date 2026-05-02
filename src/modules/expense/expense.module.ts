import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Expense } from "./expense.entity";
import { ExpenseHistory } from "./expense-history.entity";
import { ExpenseService } from "./expense.service";
import { ExpenseController } from "./expense.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Expense, ExpenseHistory])],
  controllers: [ExpenseController],
  providers: [ExpenseService],
  exports: [ExpenseService],
})
export class ExpenseModule {}
