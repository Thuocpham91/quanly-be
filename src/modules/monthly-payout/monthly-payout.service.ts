import { Injectable, HttpStatus, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { MonthlyPayout } from "./monthly-payout.entity";
import { SavePayoutDto } from "./dto/monthly-payout.dto";
import { SuccessCode } from "@common/constans/message-code.enum";

@Injectable()
export class MonthlyPayoutService {
  private readonly logger = new Logger(MonthlyPayoutService.name);

  constructor(
    @InjectRepository(MonthlyPayout)
    private readonly repo: Repository<MonthlyPayout>,
  ) {}

  async getAll(): Promise<any> {
    const data = await this.repo.find({ relations: ["user"] });
    return {
      statusCode: HttpStatus.OK,
      data,
      message: SuccessCode.SUCCESS,
    };
  }

  async getByUserMonthYear(userId: string, month: number, year: number): Promise<any> {
    const payout = await this.repo.findOne({ 
      where: { userId: userId + "", month, year } 
    });
    
    return {
      statusCode: HttpStatus.OK,
      data: payout || null,
      message: SuccessCode.SUCCESS,
    };
  }

  async savePayout(dto: SavePayoutDto): Promise<any> {
    let payout = await this.repo.findOne({ 
      where: { userId: dto.userId + "", month: dto.month, year: dto.year } 
    });

    if (payout) {
      if (dto.isPaid !== undefined) payout.isPaid = dto.isPaid;
      if (dto.totalQuantity !== undefined) payout.totalQuantity = dto.totalQuantity;
      if (dto.percentage !== undefined) payout.percentage = dto.percentage;
      if (dto.actualRevenue !== undefined) payout.actualRevenue = dto.actualRevenue;
      payout = await this.repo.save(payout);
    } else {
      const newEntity = this.repo.create({
        ...dto,
        isPaid: dto.isPaid !== undefined ? dto.isPaid : true,
        totalQuantity: dto.totalQuantity ?? 0,
        percentage: dto.percentage ?? 0,
        actualRevenue: dto.actualRevenue ?? 0,
      });
      payout = await this.repo.save(newEntity);
    }

    return {
      statusCode: HttpStatus.OK,
      data: payout,
      message: SuccessCode.SUCCESS,
    };
  }

  async markPaid(userId: string, month: number, year: number, isPaid: boolean): Promise<any> {
    let payout = await this.repo.findOne({ where: { userId: userId + "", month, year } });
    if (payout) {
      payout.isPaid = isPaid;
      payout = await this.repo.save(payout);
    } else {
      const newEntity = this.repo.create({ userId, month, year, isPaid, totalQuantity: 0, percentage: 0, actualRevenue: 0 });
      payout = await this.repo.save(newEntity);
    }
    return { statusCode: HttpStatus.OK, data: payout, message: SuccessCode.SUCCESS };
  }
}
