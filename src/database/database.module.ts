import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Role } from "../modules/role/role.entity";
import { DatabaseSeederService } from "./database.seeder";

@Module({
  imports: [TypeOrmModule.forFeature([Role])],
  providers: [DatabaseSeederService],
})
export class DatabaseModule {}
