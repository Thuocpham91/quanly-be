import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { MonthlyPayoutService } from "./monthly-payout.service";
import { SavePayoutDto } from "./dto/monthly-payout.dto";
import { AuthCustom } from "@core/decorators/auth-custom.decorator";

@ApiTags("Monthly Payout Management")
@AuthCustom()
@Controller("monthly-payouts")
export class MonthlyPayoutController {
  constructor(private readonly service: MonthlyPayoutService) {}

  @Get()
  @ApiOperation({ summary: "Get all payouts" })
  async getAll() {
    return await this.service.getAll();
  }

  @Get("status")
  @ApiOperation({ summary: "Get payout status by user, month, year" })
  async getStatus(@Query("userId") userId: string, @Query("month") month: number, @Query("year") year: number) {
    return await this.service.getByUserMonthYear(userId, month, year);
  }

  @Patch(":userId/paid")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Toggle isPaid for a user's payout by month/year" })
  async markPaid(
    @Param("userId") userId: string,
    @Query("month") month: number,
    @Query("year") year: number,
    @Body("isPaid") isPaid: boolean
  ) {
    return await this.service.markPaid(userId, Number(month), Number(year), isPaid);
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Create or Update payout status" })
  async savePayout(@Body() dto: SavePayoutDto) {
    return await this.service.savePayout(dto);
  }
}
