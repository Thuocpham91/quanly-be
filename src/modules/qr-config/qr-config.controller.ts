import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { QrConfigService } from "./qr-config.service";
import { CreateQrConfigDto, UpdateQrConfigDto } from "./dto/qr-config.dto";
import { AuthCustom } from "@core/decorators/auth-custom.decorator";
import { UserRoleEnum } from "@common/constans/enum.constant";

@ApiTags("QR Configuration Management")
@AuthCustom()
@Controller("qr-configs")
export class QrConfigController {
  constructor(private readonly service: QrConfigService) {}

  @Get()
  @ApiOperation({ summary: "Get all QR configurations" })
  async getAll() {
    return this.service.getAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "Get QR config by ID" })
  async getById(@Param("id") id: string) {
    return this.service.getById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @AuthCustom(UserRoleEnum.ADMIN, UserRoleEnum.MANAGER)
  @ApiOperation({ summary: "Create a new QR configuration" })
  async create(@Body() dto: CreateQrConfigDto) {
    return this.service.create(dto);
  }

  @Put(":id")
  @AuthCustom(UserRoleEnum.ADMIN, UserRoleEnum.MANAGER)
  @ApiOperation({ summary: "Update QR configuration" })
  async update(@Param("id") id: string, @Body() dto: UpdateQrConfigDto) {
    return this.service.update(id, dto);
  }

  @Delete(":id")
  @AuthCustom(UserRoleEnum.ADMIN, UserRoleEnum.MANAGER)
  @ApiOperation({ summary: "Delete QR configuration" })
  async delete(@Param("id") id: string) {
    return this.service.delete(id);
  }
}
