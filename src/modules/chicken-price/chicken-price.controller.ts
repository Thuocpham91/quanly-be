import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { ChickenPriceService } from "./chicken-price.service";
import { CreateChickenPriceDto, UpdateChickenPriceDto } from "./dto/chicken-price.dto";
import { AuthCustom } from "@core/decorators/auth-custom.decorator";

@ApiTags("Chicken Price Management")
@Controller("chicken-prices")
export class ChickenPriceController {
  constructor(private readonly service: ChickenPriceService) {}

  // Public: lấy giá hôm nay (không cần xác thực nặng nhưng dùng AuthCustom để lấy user nếu cần)
  @Get("today")
  @AuthCustom()
  @ApiOperation({ summary: "Get today's chicken price" })
  async getToday() {
    return this.service.getToday();
  }

  @Get()
  @AuthCustom()
  @ApiOperation({ summary: "Get all chicken prices" })
  async getAll() {
    return this.service.getAll();
  }

  @Post()
  @AuthCustom()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Create a new chicken price" })
  async create(@Body() dto: CreateChickenPriceDto) {
    return this.service.create(dto);
  }

  @Put(":id")
  @AuthCustom()
  @ApiOperation({ summary: "Update chicken price" })
  async update(@Param("id") id: number, @Body() dto: UpdateChickenPriceDto) {
    return this.service.update(id, dto);
  }

  @Delete(":id")
  @AuthCustom()
  @ApiOperation({ summary: "Delete chicken price" })
  async delete(@Param("id") id: number) {
    return this.service.delete(id);
  }
}
