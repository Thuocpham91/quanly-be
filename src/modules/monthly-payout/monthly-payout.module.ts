import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MonthlyPayout } from "./monthly-payout.entity";
import { MonthlyPayoutService } from "./monthly-payout.service";
import { MonthlyPayoutController } from "./monthly-payout.controller";

@Module({
  imports: [TypeOrmModule.forFeature([MonthlyPayout])],
  providers: [MonthlyPayoutService],
  controllers: [MonthlyPayoutController],
  exports: [MonthlyPayoutService],
})
export class MonthlyPayoutModule {}
