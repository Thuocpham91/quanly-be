import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CallHistory } from "./call-history.entity";
import { CallHistoryService } from "./call-history.service";
import { CallHistoryController } from "./call-history.controller";
import { Customer } from "../customer/customer.entity";
import { User } from "../user/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([CallHistory, Customer, User])],
  controllers: [CallHistoryController],
  providers: [CallHistoryService],
  exports: [CallHistoryService],
})
export class CallHistoryModule {}
