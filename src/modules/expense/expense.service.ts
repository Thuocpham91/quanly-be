import { Injectable, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Expense } from "./expense.entity";
import { CreateExpenseDto, UpdateExpenseDto, SearchExpenseDto } from "./dto/expense.dto";
import { ExpenseResponseDto, ExpenseListResponse } from "./dto/response/expense.response";
import { BaseService } from "@common/services/base.service";
import { SuccessCode } from "@common/constans/message-code.enum";
import { WorkResponseDto } from "../work/dto/response/work.response";

@Injectable()
export class ExpenseService extends BaseService<Expense, ExpenseResponseDto> {
  constructor(
    @InjectRepository(Expense)
    private readonly expenseRepo: Repository<Expense>,
  ) {
    super(expenseRepo, ExpenseResponseDto);
  }

  async create(dto: CreateExpenseDto): Promise<{ statusCode: number; data: ExpenseResponseDto; message: string }> {
    const expense = this.expenseRepo.create(dto);
    
    // If not DEBT, usually it's fully paid
    if (expense.type !== 'DEBT' && expense.paidAmount === undefined) {
      expense.paidAmount = expense.amount;
    }

    // Auto update status based on paid amount
    if (expense.type === 'DEBT') {
      expense.debtStatus = expense.paidAmount >= expense.amount ? 'PAID' : 'PENDING';
    }

    const saved = await this.expenseRepo.save(expense);
    return {
      statusCode: HttpStatus.CREATED,
      data: this.toDto(saved),
      message: SuccessCode.SUCCESS,
    };
  }

  async search(query: SearchExpenseDto): Promise<{ statusCode: number; data: ExpenseResponseDto[]; pagination: any; message: string }> {
    const { keyword, category, workId, fromDate, toDate, page = 1, limit = 10, sortBy = "date", sortOrder = "DESC" } = query;
    
    const qb = this.expenseRepo.createQueryBuilder("entity");
    qb.leftJoinAndSelect("entity.work", "work");
    qb.leftJoinAndSelect("work.object", "object");

    if (keyword) {
      qb.andWhere("(LOWER(entity.title) LIKE LOWER(:keyword) OR LOWER(entity.description) LIKE LOWER(:keyword))", {
        keyword: `%${keyword}%`,
      });
    }

    if (category) {
      qb.andWhere("entity.category = :category", { category });
    }

    if (query.type) {
      qb.andWhere("entity.type = :type", { type: query.type });
    }

    if (workId) {
      qb.andWhere("entity.workId = :workId", { workId });
    }

    if (query.debtStatus) {
      qb.andWhere("entity.debtStatus = :debtStatus", { debtStatus: query.debtStatus });
    }

    if (query.debtType) {
      qb.andWhere("entity.debtType = :debtType", { debtType: query.debtType });
    }

    if (fromDate) {
      qb.andWhere("entity.date >= :fromDate", { fromDate });
    }

    if (toDate) {
      qb.andWhere("entity.date <= :toDate", { toDate });
    }

    qb.orderBy(`entity.${sortBy}`, sortOrder);

    const { data, pagination } = await this.paginate(qb, { page, limit }, { work: WorkResponseDto });

    return {
      statusCode: HttpStatus.OK,
      data,
      pagination,
      message: SuccessCode.SUCCESS,
    };
  }

  async update(id: string, dto: UpdateExpenseDto): Promise<{ statusCode: number; data: ExpenseResponseDto; message: string }> {
    const expense = await this.expenseRepo.findOne({ where: { id } });
    if (!expense) {
      throw new Error(`Expense with ID ${id} not found`);
    }
    Object.assign(expense, dto);

    // Auto update status if it's a debt
    if (expense.type === 'DEBT') {
      expense.debtStatus = expense.paidAmount >= expense.amount ? 'PAID' : 'PENDING';
    }

    const saved = await this.expenseRepo.save(expense);
    return {
      statusCode: HttpStatus.OK,
      data: this.toDto(saved, { work: WorkResponseDto }),
      message: SuccessCode.SUCCESS,
    };
  }

  async delete(id: string): Promise<{ statusCode: number; message: string }> {
    await this.expenseRepo.delete(id);
    return {
      statusCode: HttpStatus.OK,
      message: SuccessCode.SUCCESS,
    };
  }

  async findByOrderId(orderId: string): Promise<Expense | null> {
    return this.expenseRepo.findOne({ where: { orderId } });
  }
}
