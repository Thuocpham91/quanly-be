import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { OrderService } from "./order.service";
import { Query } from "@nestjs/common";
import { CreateOrderDto, UpdateOrderDto, SearchOrderDto } from "./dto/order.dto";
import { OrderListResponse, OrderResponse } from "./dto/order.response";
import { AuthCustom } from "@core/decorators/auth-custom.decorator";
import { Permissions } from "@core/guards/permissions.decorator";
import { CurrentUser } from "@core/decorators/user.decorator";
import { User } from "../user/user.entity";

@ApiTags("Order Management")
@AuthCustom()
@Controller("orders")
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get("schedule")
  @ApiOperation({ summary: "Get order schedule (today and next available date)" })
  async getSchedule(@Query() params: SearchOrderDto) {
    return await this.orderService.getSchedule(params.date);
  }

  // 🔹 Get all orders
  @Get()
  @Permissions('/admin/orders:view')
  @ApiOperation({ summary: "Get all orders" })
  @ApiResponse({ status: 200, description: "List of orders" })
  async getAll(@CurrentUser() user: User): Promise<OrderListResponse> {
    return await this.orderService.getAll(user);
  }

  // 🔹 Get order by ID
  @Get(":id")
  @Permissions('/admin/orders:view')
  @ApiOperation({ summary: "Get order by ID" })
  async getById(@Param("id") id: number): Promise<OrderResponse> {
    return await this.orderService.getById(id);
  }

  // 🔹 Create order
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Permissions('/admin/orders:add')
  @ApiOperation({ summary: "Create new order" })
  @ApiResponse({ status: 201, description: "Order created successfully" })
  async create(@Body() dto: CreateOrderDto, @CurrentUser() user: User): Promise<OrderResponse> {
    return await this.orderService.createOrder(dto, user.id);
  }

  // 🔹 Update order
  @Put(":id")
  @Permissions('/admin/orders:edit')
  @ApiOperation({ summary: "Update order" })
  @ApiResponse({ status: 200, description: "Order updated successfully" })
  async update(@Param("id") id: number, @Body() dto: UpdateOrderDto): Promise<OrderResponse> {
    return await this.orderService.updateOrder(id, dto);
  }

  // 🔹 Delete order
  @Delete(":id")
  @Permissions('/admin/orders:delete')
  @ApiOperation({ summary: "Delete order" })
  @ApiResponse({ status: 200, description: "Order deleted successfully" })
  async delete(@Param("id") id: number, @CurrentUser() user: User): Promise<OrderResponse> {
    return await this.orderService.deleteOrder(id, user);
  }
}
