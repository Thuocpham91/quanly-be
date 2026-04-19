import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CustomerService } from "./customer.service";
import { CreateCustomerDto, UpdateCustomerDto, SearchCustomerDto } from "./dto/customer.dto";
import { CustomerListResponse, CustomerResponse } from "./dto/response/customer.response";
import { AuthCustom } from "@core/decorators/auth-custom.decorator";
import { CurrentUser } from "@core/decorators/user.decorator";
import { User } from "../user/user.entity";

@ApiTags("Customer Management")
@Controller("customers")
@AuthCustom()
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Search and list customers" })
  async search(@Query() params: SearchCustomerDto, @CurrentUser() user: User): Promise<CustomerListResponse> {
    return await this.customerService.search(params, user.id);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get customer details by ID" })
  async getById(@Param("id") id: string, @CurrentUser() user: User): Promise<CustomerResponse> {
    return await this.customerService.getById(id, user.id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Create a new customer" })
  @ApiResponse({ status: 201, description: "Customer created successfully" })
  async create(@Body() dto: CreateCustomerDto, @CurrentUser() user: User): Promise<CustomerResponse> {
    return await this.customerService.createCustomer(dto, user.id);
  }

  @Put(":id")
  @ApiOperation({ summary: "Update a customer" })
  async update(
    @Param("id") id: string,
    @Body() dto: UpdateCustomerDto,
    @CurrentUser() user: User,
  ): Promise<CustomerResponse> {
    return await this.customerService.updateCustomer(id, dto, user.id);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a customer" })
  async delete(@Param("id") id: string, @CurrentUser() user: User): Promise<CustomerResponse> {
    return await this.customerService.deleteCustomer(id, user.id);
  }
}
