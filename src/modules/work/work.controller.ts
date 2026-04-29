import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, Req } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { WorkService } from "./work.service";
import { CreateWorkDto, UpdateWorkDto, SearchWorkDto, UpdateWorkTaskDto, SearchWorkTaskDto } from "./dto/work.dto";
import { WorkListResponse, WorkResponse } from "./dto/response/work.response";

@ApiTags("Work Management")
@Controller("works")
export class WorkController {
  constructor(private readonly workService: WorkService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Search and filter works" })
  async search(@Query() params: SearchWorkDto): Promise<WorkListResponse> {
    return await this.workService.search(params);
  }

  @Get("tasks")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Search and filter work tasks" })
  async searchTasks(@Query() params: SearchWorkTaskDto) {
    return await this.workService.searchTasks(params);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get work by ID" })
  async getById(@Param("id") id: number): Promise<WorkResponse> {
    return await this.workService.getById(id);
  }

  @Get(":workId/tasks")
  @ApiOperation({ summary: "Get all tasks of a work" })
  async getTasksByWorkId(@Param("workId") workId: number) {
    return await this.workService.getWorkTasksByWorkId(workId);
  }

  @Get("tasks/:id")
  @ApiOperation({ summary: "Get a specific work task by ID" })
  async getTaskById(@Param("id") id: number) {
    return await this.workService.getWorkTaskById(id);
  }

  @Put("tasks/:id")
  @ApiOperation({ summary: "Update a specific work task" })
  @ApiResponse({ status: 200, description: "Work task updated successfully" })
  async updateTask(@Param("id") id: number, @Body() dto: UpdateWorkTaskDto, @Req() req: any) {
    const updatedBy = req.user?.fullName || req.user?.username || undefined;
    return await this.workService.updateWorkTask(id, dto, updatedBy);
  }

  @Get("tasks/:id/history")
  @ApiOperation({ summary: "Get update history for a specific work task" })
  async getTaskHistory(@Param("id") id: number) {
    return await this.workService.getTaskHistory(id);
  }

  @Delete("tasks/:id")
  @ApiOperation({ summary: "Delete a specific work task" })
  @ApiResponse({ status: 200, description: "Work task deleted successfully" })
  async deleteTask(@Param("id") id: number) {
    return await this.workService.deleteWorkTask(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Create new work from object" })
  @ApiResponse({ status: 201, description: "Work created successfully with tasks" })
  async create(@Body() dto: CreateWorkDto): Promise<WorkResponse> {
    return await this.workService.createWork(dto);
  }

  @Put(":id")
  @ApiOperation({ summary: "Update work" })
  @ApiResponse({ status: 200, description: "Work updated successfully" })
  async update(@Param("id") id: number, @Body() dto: UpdateWorkDto): Promise<WorkResponse> {
    return await this.workService.updateWork(id, dto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete work" })
  @ApiResponse({ status: 200, description: "Work deleted successfully" })
  async delete(@Param("id") id: number): Promise<WorkResponse> {
    return await this.workService.deleteWork(id);
  }
}
