import { Injectable, NotFoundException, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CallHistory } from "./call-history.entity";
import { CreateCallHistoryDto, SearchCallHistoryDto } from "./dto/call-history.dto";
import { User } from "../user/user.entity";

@Injectable()
export class CallHistoryService {
  constructor(
    @InjectRepository(CallHistory)
    private readonly callHistoryRepo: Repository<CallHistory>,
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
}
