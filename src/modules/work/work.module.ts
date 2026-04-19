import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { WorkController } from "./work.controller";
import { WorkService } from "./work.service";
import { Work } from "./work.entity";
import { ObjectEntity } from "../object/object.entity";
import { ObjectTask } from "../object/object-task.entity";

import { WorkTask } from "./work-task.entity";

import { Order } from "../order/order.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Work, WorkTask, ObjectEntity, ObjectTask, Order])],
  controllers: [WorkController],
  providers: [WorkService],
  exports: [WorkService],
})
export class WorkModule {}
