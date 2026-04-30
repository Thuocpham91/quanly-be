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

  async search(params: SearchCustomerDto, user: User): Promise<CustomerListResponse> {
    const isAdminOrStaff = this.isAdminOrStaff(user);
    const query = this.customerRepo.createQueryBuilder("customer");
 
    if (!isAdminOrStaff) {
      query.andWhere("customer.userId = :userId", { userId: user.id });
    }
 
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
 
  async getById(id: string, user: User): Promise<CustomerResponse> {
    const isAdminOrStaff = this.isAdminOrStaff(user);
    const where = isAdminOrStaff ? { id } : { id, userId: user.id };
    
    const customer = await this.customerRepo.findOne({ where });
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

  async updateCustomer(id: string, dto: UpdateCustomerDto, user: User): Promise<CustomerResponse> {
    const isAdminOrManager = this.isAdminOrManager(user);
    const isAdminOrStaff = this.isAdminOrStaff(user);
    
    const where = isAdminOrStaff ? { id } : { id, userId: user.id };
    const customer = await this.customerRepo.findOne({ where });
    if (!customer) throw new NotFoundException(`Customer with ID ${id} not found`);

    const isAllowedEditor = customer.editorIds && customer.editorIds.includes(user.id);

    if (!isAdminOrManager && customer.userId !== user.id && !isAllowedEditor) {
      throw new Error("Bạn không có quyền chỉnh sửa khách hàng này.");
    }

    if (dto.email && dto.email !== customer.email) {
      const existing = await this.customerRepo.findOne({ where: { email: dto.email, userId: user.id } });
      if (existing) throw new ConflictException(`Customer with email ${dto.email} already exists for this user`);
    }

    Object.assign(customer, dto);
    const updated = await this.customerRepo.save(customer);
    this.logger.log(`Customer updated: ${id} for user: ${user.id}`);

    return {
      statusCode: HttpStatus.OK,
      message: SuccessCode.SUCCESS,
      data: this.toDto(updated),
    };
  }

  async deleteCustomer(id: string, user: User): Promise<CustomerResponse> {
    const isAdminOrManager = this.isAdminOrManager(user);
    const isAdminOrStaff = this.isAdminOrStaff(user);
    
    const where = isAdminOrStaff ? { id } : { id, userId: user.id };
    const customer = await this.customerRepo.findOne({ where });
    if (!customer) throw new NotFoundException(`Customer with ID ${id} not found`);

    const isAllowedEditor = customer.editorIds && customer.editorIds.includes(user.id);

    if (!isAdminOrManager && customer.userId !== user.id && !isAllowedEditor) {
      throw new Error("Bạn không có quyền xóa khách hàng này.");
    }

    await this.customerRepo.softRemove(customer);
    this.logger.log(`Customer deleted: ${id} for user: ${user.id}`);

    return {
      statusCode: HttpStatus.OK,
      message: SuccessCode.SUCCESS,
      data: undefined,
    };
  }

  async shareCustomer(id: string, editorIds: string[], user: User): Promise<CustomerResponse> {
    const customer = await this.customerRepo.findOne({ where: { id } });
    if (!customer) throw new NotFoundException(`Customer with ID ${id} not found`);

    const isAdminOrManager = this.isAdminOrManager(user);
    if (!isAdminOrManager && customer.userId !== user.id) {
      throw new Error("Chỉ người tạo hoặc quản lý mới có quyền cấp quyền chỉnh sửa.");
    }

    customer.editorIds = editorIds;
    const updated = await this.customerRepo.save(customer);

    return {
      statusCode: HttpStatus.OK,
      message: SuccessCode.SUCCESS,
      data: this.toDto(updated),
    };
  }

  async findByUserCustomId(userCustomId: string, user: User): Promise<CustomerResponse> {
    let customer = await this.customerRepo.findOne({ 
      where: { userCustomId: userCustomId }
    });
    
    if (!customer) {
      // Auto-create if not exists
      this.logger.log(`Customer record not found for user ${userCustomId}. Attempting auto-creation...`);
      const targetUser = await this.userRepo.findOne({ where: { id: userCustomId } });
      if (targetUser) {
        const createDto: CreateCustomerDto = {
          name: targetUser.fullName || targetUser.username,
          email: targetUser.email,
          phone: targetUser.phone,
          userCustomId: userCustomId,
          isSelfCustomer: true,
          note: "Hồ sơ tự động tạo khi truy cập từ lịch trình"
        };
        const res = await this.createCustomer(createDto, user.id);
        return res;
      }
      throw new NotFoundException(`No customer found for User ID ${userCustomId}`);
    }

    return {
      statusCode: HttpStatus.OK,
      message: SuccessCode.SUCCESS,
      data: this.toDto(customer),
    };
  }

  private isAdminOrStaff(user: any): boolean {
    const roleCode = user.role?.code || '';
    return ['ADMIN', 'MANAGER', 'STAFF'].includes(roleCode);
  }

  private isAdminOrManager(user: any): boolean {
    const roleCode = user.role?.code || '';
    return ['ADMIN', 'MANAGER'].includes(roleCode);
  }
}
