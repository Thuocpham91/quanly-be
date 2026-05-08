import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  Request,
  NotFoundException,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { UserService } from "./user.service";
import {
  CreateUserDto,
  UpdateUserDto,
  SearchUserDto,
  UpdateRoleDto,
  UpdateStatusDto,
  AuthRequestDto,
} from "./dto/user.dto";
import { UserResponseDto } from "./dto/response/user.response.dto";
import { CustomHttpException } from "@common/exceptions/custom-http.exception";
import { Roles } from "@core/guards/roles.decorator";
import { Permissions } from "@core/guards/permissions.decorator";
import { RolesPermissionsGuard } from "@core/guards/roles-permissions.guard";
import { JwtAuthGuard } from "@core/guards/jwt-auth.guard";
import { AuthCustom } from "@core/decorators/auth-custom.decorator";
import { UserListResponse, UserResponse } from "./dto/response/user.response";

@ApiTags("User Management")
@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  // 🔹 Get all users
  @Get()
  @AuthCustom()
  @Permissions('/admin/users:view')
  @ApiOperation({ summary: "Get all users" })
  @ApiResponse({ status: 200, description: "List of users" })
  async getAll(): Promise<UserListResponse> {
    return await this.userService.getAll();
  }

  // � Get revenue for all users
  @Get("revenue/all")
  @ApiOperation({ summary: "Get actual revenue for all users" })
  @ApiResponse({ status: 200, description: "All users revenue data" })
  async getAllUsersRevenue() {
    return await this.userService.getAllUsersRevenue();
  }

  // 💰 Get revenue for specific user
  @Get(":id/revenue")
  @ApiOperation({ summary: "Get actual revenue for user (Order Amount × Percentage / 100)" })
  @ApiResponse({ status: 200, description: "User revenue data" })
  async getUserRevenue(@Param("id") id: number) {
    return await this.userService.getUserRevenue(id);
  }

  // 🔹 Get user by ID
  @Get(":id")
  @AuthCustom()
  @Permissions('/admin/users:view')
  @ApiOperation({ summary: "Get user by ID" })
  async getById(@Param("id") id: number): Promise<UserResponse> {
    const user = await this.userService.getById(id);
    return user;
  }

  // 🔹 Create user
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @AuthCustom()
  @Permissions('/admin/users:add')
  @ApiOperation({ summary: "Create new user" })
  @ApiResponse({ status: 201, description: "User created successfully" })
  async create(@Body() dto: CreateUserDto): Promise<UserResponse> {
    return await this.userService.createUser(dto);
  }

  // 🔹 Update user
  @Put(":id")
  @AuthCustom()
  @Permissions('/admin/users:edit')
  @ApiOperation({ summary: "Update user" })
  @ApiResponse({ status: 200, description: "User updated successfully" })
  async update(@Param("id") id: number, @Body() dto: UpdateUserDto): Promise<UserResponse> {
    return await this.userService.updateUser(id, dto);
  }

  // 🔹 Delete user
  @Delete(":id")
  @AuthCustom()
  @Permissions('/admin/users:delete')
  @ApiOperation({ summary: "Delete user" })
  @ApiResponse({ status: 200, description: "User deleted successfully" })
  async delete(@Param("id") id: number): Promise<UserResponse> {
    return await this.userService.deleteUser(id);
  }
}
