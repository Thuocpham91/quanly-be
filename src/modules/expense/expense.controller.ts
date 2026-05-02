import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { ExpenseService } from "./expense.service";
import { CreateExpenseDto, UpdateExpenseDto, SearchExpenseDto } from "./dto/expense.dto";

@ApiTags("Expense Management")
@Controller("expenses")
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Post()
  @ApiOperation({ summary: "Create a new expense" })
  async create(@Body() dto: CreateExpenseDto) {
    return await this.expenseService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: "Search expenses" })
  async search(@Query() query: SearchExpenseDto) {
    return await this.expenseService.search(query);
  }

  @Put(":id")
  @ApiOperation({ summary: "Update an expense" })
  async update(@Param("id") id: string, @Body() dto: UpdateExpenseDto) {
    return await this.expenseService.update(id, dto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete an expense" })
  async delete(@Param("id") id: string) {
    return await this.expenseService.delete(id);
  }

  @Get(":id/history")
  @ApiOperation({ summary: "Get expense update history" })
  async getHistory(@Param("id") id: string) {
    return await this.expenseService.getHistory(id);
  }
}
