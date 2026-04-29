import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Order } from "./order.entity";
import { OrderService } from "./order.service";
import { OrderController } from "./order.controller";
import { User } from "../user/user.entity";
import { Work } from "../work/work.entity";
import { CustomerModule } from "../customer/customer.module";
import { Customer } from "@modules/customer/customer.entity";
import { MonthlyPayoutModule } from "../monthly-payout/monthly-payout.module";
import { ExpenseModule } from "../expense/expense.module";

@Module({
  imports: [TypeOrmModule.forFeature([Order, User, Work, Customer]), CustomerModule, MonthlyPayoutModule, ExpenseModule],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
