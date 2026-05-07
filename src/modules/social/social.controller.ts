import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { SocialService } from "./social.service";
import { CreateFbGroupDto, UpdateFbGroupDto } from "./dto/fb-group.dto";
import { CreateFbPostTemplateDto, UpdateFbPostTemplateDto } from "./dto/fb-post-template.dto";
import { AuthCustom } from "@core/decorators/auth-custom.decorator";
import { CurrentUser } from "@core/decorators/user.decorator";
import { UserEntity } from "@modules/user/user.entity";

@ApiTags("Social Management")
@Controller("social")
@AuthCustom()
export class SocialController {
  constructor(private readonly socialService: SocialService) {}

  // Groups
  @Get("groups")
  @ApiOperation({ summary: "Get all FB groups for current user" })
  async getGroups(@CurrentUser() user: UserEntity) {
    return await this.socialService.findAllGroups(user.id);
  }

  @Post("groups")
  @ApiOperation({ summary: "Create new FB group" })
  async createGroup(@CurrentUser() user: UserEntity, @Body() dto: CreateFbGroupDto) {
    return await this.socialService.createGroup(user.id, dto);
  }

  @Put("groups/:id")
  @ApiOperation({ summary: "Update FB group" })
  async updateGroup(@CurrentUser() user: UserEntity, @Param("id") id: string, @Body() dto: UpdateFbGroupDto) {
    return await this.socialService.updateGroup(id, user.id, dto);
  }

  @Delete("groups/:id")
  @ApiOperation({ summary: "Delete FB group" })
  async deleteGroup(@CurrentUser() user: UserEntity, @Param("id") id: string) {
    return await this.socialService.deleteGroup(id, user.id);
  }

  // Templates
  @Get("templates")
  @ApiOperation({ summary: "Get all FB post templates for current user" })
  async getTemplates(@CurrentUser() user: UserEntity) {
    return await this.socialService.findAllTemplates(user.id);
  }

  @Post("templates")
  @ApiOperation({ summary: "Create new FB post template" })
  async createTemplate(@CurrentUser() user: UserEntity, @Body() dto: CreateFbPostTemplateDto) {
    return await this.socialService.createTemplate(user.id, dto);
  }

  @Put("templates/:id")
  @ApiOperation({ summary: "Update FB post template" })
  async updateTemplate(@CurrentUser() user: UserEntity, @Param("id") id: string, @Body() dto: UpdateFbPostTemplateDto) {
    return await this.socialService.updateTemplate(id, user.id, dto);
  }

  @Delete("templates/:id")
  @ApiOperation({ summary: "Delete FB post template" })
  async deleteTemplate(@CurrentUser() user: UserEntity, @Param("id") id: string) {
    return await this.socialService.deleteTemplate(id, user.id);
  }
}
