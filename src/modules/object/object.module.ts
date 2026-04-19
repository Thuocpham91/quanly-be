import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ObjectController } from "./object.controller";
import { ObjectService } from "./object.service";
import { ObjectEntity } from "./object.entity";
import { ObjectTask } from "./object-task.entity";

@Module({
  imports: [TypeOrmModule.forFeature([ObjectEntity, ObjectTask])],
  controllers: [ObjectController],
  providers: [ObjectService],
  exports: [ObjectService],
})
export class ObjectModule {}
