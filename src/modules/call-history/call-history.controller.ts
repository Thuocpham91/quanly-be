import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { CallHistoryService } from "./call-history.service";
import { CreateCallHistoryDto, SearchCallHistoryDto } from "./dto/call-history.dto";
import { AuthCustom } from "@core/decorators/auth-custom.decorator";
import { CurrentUser } from "@core/decorators/user.decorator";
import { User } from "../user/user.entity";

@ApiTags("Call History")
@AuthCustom()
@Controller("call-histories")
export class CallHistoryController {
  constructor(private readonly callHistoryService: CallHistoryService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Log a new call history record" })
  async create(@Body() dto: CreateCallHistoryDto, @CurrentUser() user: User) {
    return await this.callHistoryService.create(dto, user);
  }

  @Get()
  @ApiOperation({ summary: "Get call histories (filter by customerId)" })
  async findAll(@Query() query: SearchCallHistoryDto) {
    return await this.callHistoryService.findByCustomer(query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a single call history by ID" })
  async findOne(@Param("id") id: string) {
    return await this.callHistoryService.findById(id);
  }
}
