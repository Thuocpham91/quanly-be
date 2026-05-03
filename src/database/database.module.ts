import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Role } from "../modules/role/role.entity";
import { ChickenPrice } from "../modules/chicken-price/chicken-price.entity";
import { ObjectEntity } from "../modules/object/object.entity";
import { ObjectTask } from "../modules/object/object-task.entity";
import { DatabaseSeederService } from "./database.seeder";

@Module({
  imports: [TypeOrmModule.forFeature([Role, ChickenPrice, ObjectEntity, ObjectTask])],
  providers: [DatabaseSeederService],
})
export class DatabaseModule {}
