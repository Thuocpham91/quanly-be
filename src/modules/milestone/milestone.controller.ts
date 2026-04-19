import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { MilestoneService } from "./milestone.service";
import { CreateMilestoneDto, UpdateMilestoneDto } from "./dto/milestone.dto";
import { AuthCustom } from "@core/decorators/auth-custom.decorator";

@ApiTags("Milestone Management")
@AuthCustom()
@Controller("milestones")
export class MilestoneController {
  constructor(private readonly service: MilestoneService) {}

  @Get()
  @ApiOperation({ summary: "Get all milestones" })
  async getAll() {
    return await this.service.getAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "Get milestone by ID" })
  async getById(@Param("id") id: number) {
    return await this.service.getById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Create new milestone" })
  async create(@Body() dto: CreateMilestoneDto) {
    return await this.service.create(dto);
  }

  @Put(":id")
  @ApiOperation({ summary: "Update milestone" })
  async update(@Param("id") id: number, @Body() dto: UpdateMilestoneDto) {
    return await this.service.update(id, dto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete milestone" })
  async delete(@Param("id") id: number) {
    return await this.service.delete(id);
  }
}
