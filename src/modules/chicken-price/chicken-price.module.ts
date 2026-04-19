import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChickenPrice } from "./chicken-price.entity";
import { ChickenPriceController } from "./chicken-price.controller";
import { ChickenPriceService } from "./chicken-price.service";

@Module({
  imports: [TypeOrmModule.forFeature([ChickenPrice])],
  controllers: [ChickenPriceController],
  providers: [ChickenPriceService],
  exports: [ChickenPriceService],
})
export class ChickenPriceModule {}
