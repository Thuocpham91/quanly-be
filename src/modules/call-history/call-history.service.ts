import { Injectable, NotFoundException, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CallHistory } from "./call-history.entity";
import { Customer } from "../customer/customer.entity";
import {
  CreateCallHistoryDto,
  SearchCallHistoryDto,
  CallStatusFilterDto,
  CallFilterType,
} from "./dto/call-history.dto";
import { User } from "../user/user.entity";

@Injectable()
export class CallHistoryService {
  constructor(
    @InjectRepository(CallHistory)
    private readonly callHistoryRepo: Repository<CallHistory>,
    @InjectRepository(Customer)
    private readonly customerRepo: Repository<Customer>,
  ) {}

  async create(dto: CreateCallHistoryDto, calledBy?: User): Promise<any> {
    const record = this.callHistoryRepo.create({
      customerId: dto.customerId,
      calledById: calledBy?.id,
      note: dto.note,
    });
    const saved = await this.callHistoryRepo.save(record);
    return {
      statusCode: HttpStatus.CREATED,
      data: saved,
      message: "Call history recorded successfully",
    };
  }

  async findByCustomer(query: SearchCallHistoryDto): Promise<any> {
    const where: any = {};
    if (query.customerId) {
      where.customerId = query.customerId;
    }

    const records = await this.callHistoryRepo.find({
      where,
      relations: ["calledBy"],
      order: { createdAt: "DESC" },
    });

    return {
      statusCode: HttpStatus.OK,
      data: records,
      message: "Success",
    };
  }

  async findById(id: string): Promise<any> {
    const record = await this.callHistoryRepo.findOne({ where: { id }, relations: ["customer", "calledBy"] });
    if (!record) throw new NotFoundException(`Call history #${id} not found`);
    return {
      statusCode: HttpStatus.OK,
      data: record,
      message: "Success",
    };
  }

  /**
   * Trả về danh sách customer với ngày gọi cuối,
   * đã lọc theo callFilter.
   */
  async getCustomerCallStatus(dto: CallStatusFilterDto): Promise<any> {
    // 1. Get all customers to ensure we cover those who have never been called
    const allCustomers = await this.customerRepo.find({ select: ["id"] });

    // 2. Get latest call per customer
    const latestCalls: { customerId: string; lastCalledAt: Date }[] =
      await this.callHistoryRepo
        .createQueryBuilder("ch")
        .select("ch.customerId", "customerId")
        .addSelect("MAX(ch.createdAt)", "lastCalledAt")
        .groupBy("ch.customerId")
        .getRawMany();

    const callMap = new Map<string, Date>(
      latestCalls.map((r) => [r.customerId, new Date(r.lastCalledAt)]),
    );

    const now = Date.now();
    const DAY_MS = 86_400_000;

    const filter = dto.callFilter || "ALL";

    // 3. Map all customers to their call status
    const customerStatuses = allCustomers.map((c) => {
      const lastCalledAt = callMap.get(c.id) || null;
      const daysSinceLastCall = lastCalledAt
        ? Math.floor((now - lastCalledAt.getTime()) / DAY_MS)
        : null;
      return {
        customerId: c.id,
        lastCalledAt,
        daysSinceLastCall,
      };
    });

    // 4. Apply filter
    const matched = customerStatuses.filter((c) => {
      const callDays = c.daysSinceLastCall;
      switch (filter) {
        case "CALLED_10":
          return callDays !== null && callDays <= 10;
        case "CALLED_60":
          return callDays !== null && callDays <= 60;
        case "NOT_CALLED":
          return callDays === null;
        case "NO_CALL_10":
          return callDays === null || callDays > 10;
        case "NO_CALL_60":
          return callDays === null || callDays > 60;
        case "NO_CALL_5M":
          return callDays === null || callDays > 150;
        case "ALL":
        default:
          return true;
      }
    });

    return {
      statusCode: HttpStatus.OK,
      data: matched,
      message: "Success",
    };
  }
}
