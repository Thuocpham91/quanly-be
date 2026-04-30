import { Injectable, NotFoundException, ConflictException, HttpStatus, Logger, Inject } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Customer } from "./customer.entity";
import { User } from "../user/user.entity";
import { Role } from "../role/role.entity";
import { CreateCustomerDto, UpdateCustomerDto, SearchCustomerDto } from "./dto/customer.dto";
import { CustomerResponseDto } from "./dto/response/customer.response.dto";
import { CustomerListResponse, CustomerResponse } from "./dto/response/customer.response";
import { plainToInstance } from "class-transformer";
import { SuccessCode } from "@common/constans/message-code.enum";
import { RoleCodeEnum } from "@common/enum/psvn-enum";

@Injectable()
export class CustomerService {
  private readonly logger = new Logger(CustomerService.name);

  constructor(
    @InjectRepository(Customer)
    private readonly customerRepo: Repository<Customer>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
  ) {}

  private toDto(customer: Customer): CustomerResponseDto {
    return plainToInstance(CustomerResponseDto, customer, { excludeExtraneousValues: true });
  }

  async findOne(options: any): Promise<Customer | null> {
    return await this.customerRepo.findOne(options);
  }

  async search(params: SearchCustomerDto, userId: string): Promise<CustomerListResponse> {
    const query = this.customerRepo.createQueryBuilder("customer");

    // Filter by userId
    query.andWhere("customer.userId = :userId", { userId });

    if (params.keyword) {
      query.andWhere("customer.name ILIKE :keyword OR customer.email ILIKE :keyword", {
        keyword: `%${params.keyword}%`,
      });
    }

    if (typeof params.isActive === "boolean") {
      query.andWhere("customer.isActive = :isActive", { isActive: params.isActive });
    }

    const sortBy = params.sortBy || "customer.createdAt";
    const sortOrder = params.sortOrder || "DESC";

    query.orderBy(sortBy, sortOrder as "ASC" | "DESC");

    const page = params.page || 1;
    const limit = params.limit || 10;
    const [items] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      statusCode: HttpStatus.OK,
      message: SuccessCode.SUCCESS,
      data: items.map((item) => this.toDto(item)),
    };
  }

  async getById(id: string, userId: string): Promise<CustomerResponse> {
    const customer = await this.customerRepo.findOne({ where: { id, userId } });
    if (!customer) throw new NotFoundException(`Customer with ID ${id} not found`);

    return {
      statusCode: HttpStatus.OK,
      message: SuccessCode.SUCCESS,
      data: this.toDto(customer),
    };
  }

  async createCustomer(dto: CreateCustomerDto, userId: string): Promise<CustomerResponse> {
    if (dto.email) {
      const existing = await this.customerRepo.findOne({ where: { email: dto.email, userId } });
      if (existing) throw new ConflictException(`Customer with email ${dto.email} already exists for this user`);
    }

    let linkedUserId = dto.userCustomId;

    if (!linkedUserId && dto.phone) {
      let userWithPhone = await this.userRepo.findOne({ where: { phone: dto.phone } });
      
      if (!userWithPhone) {
        let customerRole = await this.roleRepo.findOne({ where: { code: RoleCodeEnum.CUSTOMER } });
        if (!customerRole) {
           customerRole = await this.roleRepo.findOne({ where: { code: RoleCodeEnum.USER } });
        }
        
        userWithPhone = this.userRepo.create({
          fullName: dto.name,
          username: dto.phone,
          phone: dto.phone,
          email: dto.email || undefined,
          roleId: customerRole ? customerRole.id : undefined,
          status: "ACTIVE" as any
        });
        await this.userRepo.save(userWithPhone);
        this.logger.log(`Auto-created User account for new Customer with phone ${dto.phone}`);
      }
      linkedUserId = userWithPhone.id;
    }

    const customer = this.customerRepo.create({
      ...dto,
      userId,
      userCustomId: linkedUserId || userId, 
    });
    
    const saved = await this.customerRepo.save(customer);
    this.logger.log(`Customer created: ${saved.id} for user: ${userId}`);

    return {
      statusCode: HttpStatus.CREATED,
      message: SuccessCode.SUCCESS,
      data: this.toDto(saved),
    };
  }

  async updateCustomer(id: string, dto: UpdateCustomerDto, userId: string): Promise<CustomerResponse> {
    const customer = await this.customerRepo.findOne({ where: { id, userId } });
    if (!customer) throw new NotFoundException(`Customer with ID ${id} not found`);

    if (dto.email && dto.email !== customer.email) {
      const existing = await this.customerRepo.findOne({ where: { email: dto.email, userId } });
      if (existing) throw new ConflictException(`Customer with email ${dto.email} already exists for this user`);
    }

    Object.assign(customer, dto);
    const updated = await this.customerRepo.save(customer);
    this.logger.log(`Customer updated: ${id} for user: ${userId}`);

    return {
      statusCode: HttpStatus.OK,
      message: SuccessCode.SUCCESS,
      data: this.toDto(updated),
    };
  }

  async deleteCustomer(id: string, userId: string): Promise<CustomerResponse> {
    const customer = await this.customerRepo.findOne({ where: { id, userId } });
    if (!customer) throw new NotFoundException(`Customer with ID ${id} not found`);

    await this.customerRepo.softRemove(customer);
    this.logger.log(`Customer deleted: ${id} for user: ${userId}`);

    return {
      statusCode: HttpStatus.OK,
      message: SuccessCode.SUCCESS,
      data: undefined,
    };
  }

  async findByUserCustomId(userCustomId: string, userId: string): Promise<CustomerResponse> {
    const customer = await this.customerRepo.findOne({ 
      where: [
        { userCustomId: userCustomId, userId: userId },
        { userCustomId: userCustomId } // Fallback to global if needed
      ]
    });
    
    if (!customer) throw new NotFoundException(`No customer found for User ID ${userCustomId}`);

    return {
      statusCode: HttpStatus.OK,
      message: SuccessCode.SUCCESS,
      data: this.toDto(customer),
    };
  }
}
