import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SocialController } from "./social.controller";
import { SocialService } from "./social.service";
import { FbGroupEntity } from "./entities/fb-group.entity";
import { FbPostTemplateEntity } from "./entities/fb-post-template.entity";

@Module({
  imports: [TypeOrmModule.forFeature([FbGroupEntity, FbPostTemplateEntity])],
  controllers: [SocialController],
  providers: [SocialService],
  exports: [SocialService],
})
export class SocialModule {}
