import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { RoleService, RoleDetailResponse, RoleListResponse } from "./role.service";
import { CreateRoleDto, UpdateRoleDto } from "./dto/role.dto";
import { JwtAuthGuard } from "@core/guards/jwt-auth.guard";

@ApiTags("Role Management")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("roles")
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  // 🔹 Lấy tất cả role
  @Get()
  @ApiOperation({ summary: "Lấy danh sách tất cả role" })
  @ApiResponse({ status: 200, description: "Danh sách role", type: RoleListResponse })
  async getAll(): Promise<RoleListResponse> {
    return this.roleService.getAll();
  }

  // 🔹 Lấy chi tiết role
  @Get(":id")
  @ApiOperation({ summary: "Lấy chi tiết role theo ID" })
  @ApiResponse({ status: 200, description: "Chi tiết role", type: RoleDetailResponse })
  async getById(@Param("id") id: string): Promise<RoleDetailResponse> {
    return this.roleService.getById(id);
  }

  // 🔹 Tạo mới role
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Tạo mới role" })
  @ApiResponse({ status: 201, description: "Role đã được tạo", type: RoleDetailResponse })
  async create(@Body() dto: CreateRoleDto): Promise<RoleDetailResponse> {
    return this.roleService.create(dto);
  }

  // 🔹 Cập nhật role
  @Put(":id")
  @ApiOperation({ summary: "Cập nhật role" })
  @ApiResponse({ status: 200, description: "Role đã được cập nhật", type: RoleDetailResponse })
  async update(@Param("id") id: string, @Body() dto: UpdateRoleDto): Promise<RoleDetailResponse> {
    return this.roleService.update(id, dto);
  }

  // 🔹 Xóa role
  @Delete(":id")
  @ApiOperation({ summary: "Xóa role (soft delete)" })
  @ApiResponse({ status: 200, description: "Role đã được xóa" })
  async remove(@Param("id") id: string): Promise<RoleDetailResponse> {
    return this.roleService.remove(id);
  }
}
