import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ObjectService } from "./object.service";
import { CreateObjectDto, UpdateObjectDto } from "./dto/object.dto";
import { CreateObjectTaskDto, UpdateObjectTaskDto } from "./dto/object-task.dto";
import { ObjectListResponse, ObjectResponse } from "./dto/response/object.response";
import { ObjectTaskListResponse, ObjectTaskResponse } from "./dto/response/object-task.response";
import { AuthCustom } from "@core/decorators/auth-custom.decorator";
import { UserRoleEnum } from "@common/constans/enum.constant";

@ApiTags("Object Management")
@Controller("objects")
@AuthCustom()
export class ObjectController {
  constructor(private readonly objectService: ObjectService) {}

  @Get()
  @ApiOperation({ summary: "Get all objects" })
  @ApiResponse({ status: 200, description: "List of objects" })
  async getAll(
    @Query("page") page?: number,
    @Query("limit") limit?: number,
  ): Promise<ObjectListResponse> {
    return await this.objectService.getAll(page, limit);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get object by ID" })
  async getById(@Param("id") id: number): Promise<ObjectResponse> {
    return await this.objectService.getById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @AuthCustom(UserRoleEnum.ADMIN, UserRoleEnum.MANAGER)
  @ApiOperation({ summary: "Create new object" })
  @ApiResponse({ status: 201, description: "Object created successfully" })
  async create(@Body() dto: CreateObjectDto): Promise<ObjectResponse> {
    return await this.objectService.createObject(dto);
  }

  @Put(":id")
  @AuthCustom(UserRoleEnum.ADMIN, UserRoleEnum.MANAGER)
  @ApiOperation({ summary: "Update object" })
  @ApiResponse({ status: 200, description: "Object updated successfully" })
  async update(@Param("id") id: number, @Body() dto: UpdateObjectDto): Promise<ObjectResponse> {
    return await this.objectService.updateObject(id, dto);
  }

  @Delete(":id")
  @AuthCustom(UserRoleEnum.ADMIN)
  @ApiOperation({ summary: "Delete object" })
  @ApiResponse({ status: 200, description: "Object deleted successfully" })
  async delete(@Param("id") id: number): Promise<ObjectResponse> {
    return await this.objectService.deleteObject(id);
  }

  @Get(":id/tasks")
  @ApiOperation({ summary: "Get object tasks" })
  async getTasks(
    @Param("id") id: number,
    @Query("page") page?: number,
    @Query("limit") limit?: number,
  ): Promise<ObjectTaskListResponse> {
    return await this.objectService.getTasks(id, page, limit);
  }

  @Post(":id/tasks")
  @HttpCode(HttpStatus.CREATED)
  @AuthCustom(UserRoleEnum.ADMIN, UserRoleEnum.MANAGER)
  @ApiOperation({ summary: "Add task to object" })
  async addTask(@Param("id") id: number, @Body() dto: CreateObjectTaskDto): Promise<ObjectTaskResponse> {
    return await this.objectService.addTask(id, dto);
  }

  @Put(":id/tasks/:taskId")
  @AuthCustom(UserRoleEnum.ADMIN, UserRoleEnum.MANAGER)
  @ApiOperation({ summary: "Update object task" })
  async updateTask(
    @Param("id") id: number,
    @Param("taskId") taskId: string,
    @Body() dto: UpdateObjectTaskDto,
  ): Promise<ObjectTaskResponse> {
    return await this.objectService.updateTask(id, taskId, dto);
  }

  @Delete(":id/tasks/:taskId")
  @AuthCustom(UserRoleEnum.ADMIN, UserRoleEnum.MANAGER)
  @ApiOperation({ summary: "Delete object task" })
  async deleteTask(@Param("id") id: number, @Param("taskId") taskId: string): Promise<ObjectTaskResponse> {
    return await this.objectService.deleteTask(id, taskId);
  }
}
