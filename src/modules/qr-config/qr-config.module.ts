import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { QrConfig } from "./qr-config.entity";
import { QrConfigController } from "./qr-config.controller";
import { QrConfigService } from "./qr-config.service";

@Module({
  imports: [TypeOrmModule.forFeature([QrConfig])],
  controllers: [QrConfigController],
  providers: [QrConfigService],
  exports: [QrConfigService],
})
export class QrConfigModule {}
