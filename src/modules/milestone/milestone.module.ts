import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Milestone } from "./milestone.entity";
import { MilestoneService } from "./milestone.service";
import { MilestoneController } from "./milestone.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Milestone])],
  providers: [MilestoneService],
  controllers: [MilestoneController],
  exports: [MilestoneService],
})
export class MilestoneModule {}
