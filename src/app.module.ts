import { Module } from "@nestjs/common";
import { TerminusModule } from "@nestjs/terminus";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { configTypeORM } from "./configs";
import { DatabaseModule } from "./database/database.module";

import { UserModule } from "./modules/user/user.module";
import { AuthModule } from "./modules/auth/auth.module";
import { ObjectModule } from "./modules/object/object.module";
import { WorkModule } from "./modules/work/work.module";
import { OrderModule } from "./modules/order/order.module";
import { RoleModule } from "./modules/role/role.module";
import { CustomerModule } from "./modules/customer/customer.module";
import { MilestoneModule } from "./modules/milestone/milestone.module";
import { MonthlyPayoutModule } from "./modules/monthly-payout/monthly-payout.module";
import { ChickenPriceModule } from "./modules/chicken-price/chicken-price.module";
import { FileModule } from "@modules/file/file.module";
import { ExpenseModule } from "./modules/expense/expense.module";
import { CallHistoryModule } from "./modules/call-history/call-history.module";

@Module({
  imports: [
    TerminusModule,
    TypeOrmModule.forRoot({
      ...configTypeORM,
      subscribers: [],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env.local", ".env.sit", ".env"],
    }),

    DatabaseModule,
    UserModule,
    AuthModule,
    ObjectModule,
    WorkModule,
    OrderModule,
    RoleModule,
    CustomerModule,
    MilestoneModule,
    MonthlyPayoutModule,
    ChickenPriceModule,
    FileModule,
    ExpenseModule,
    CallHistoryModule,
  ],
})
export class AppModule {}
