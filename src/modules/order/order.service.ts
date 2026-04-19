import { Injectable, NotFoundException, HttpStatus, Logger, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Order } from "./order.entity";
import { OrderResponseDto } from "./dto/order-response.dto";
import { OrderProposalStatusEnum } from "@common/enum/psvn-enum";
import { BaseService } from "@common/services/base.service";
import { SuccessCode } from "@common/constans/message-code.enum";
import { OrderListResponse, OrderResponse } from "./dto/order.response";
import { CreateOrderDto, UpdateOrderDto } from "./dto/order.dto";
import { Work } from "../work/work.entity";
import { CustomerService } from "../customer/customer.service";
import { User } from "../user/user.entity";
import { Customer } from "@modules/customer/customer.entity";
import { MonthlyPayoutService } from "../monthly-payout/monthly-payout.service";

@Injectable()
export class OrderService extends BaseService<Order, OrderResponseDto> {
  private readonly logger = new Logger(OrderService.name);

  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,

    @InjectRepository(Work)
    private readonly workRepo: Repository<Work>,
    @InjectRepository(Customer)
    private readonly customerRepo: Repository<Customer>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    private readonly customerService: CustomerService,
    private readonly monthlyPayoutService: MonthlyPayoutService,
  ) {
    super(orderRepo, OrderResponseDto);
  }

  private buildResponse(entity: Order, relationsMap?: Record<string, any>, statusCode?: HttpStatus): OrderResponse {
    return {
      statusCode,
      data: this.toDto(entity, relationsMap),
      message: SuccessCode.SUCCESS,
    };
  }

  // 🟩 Lấy danh sách tất cả đơn hàng
  async getAll(user: User): Promise<OrderListResponse> {
    const fullUser = await this.userRepo.findOne({ where: { id: user.id }, relations: ["role"] });
    const isAdminOrStaff = ['ADMIN', 'MANAGER', 'STAFF'].includes(fullUser?.role?.code || '');

    const whereCondition = isAdminOrStaff 
      ? {} 
      : [
          { createdById: user.id },
          { userId: user.id }
        ];

    const orders = await this.orderRepo.find({ 
      where: whereCondition,
      relations: ["user", "creator", "work"],
      order: { createdAt: "DESC" }
    });

    return {
      statusCode: HttpStatus.OK,
      data: orders.map((o) => this.toDto(o)),
      message: SuccessCode.SUCCESS,
    };
  }

  // 🟦 Lấy chi tiết theo id
  async getById(id: number): Promise<OrderResponse> {
    const order = await this.orderRepo.findOne({ where: { id: id + "" }, relations: ["user", "creator", "work"] });
    if (!order) throw new NotFoundException(`Order with ID ${id} not found`);

    return this.buildResponse(order, {}, HttpStatus.OK);
  }

  // 🟨 Tạo mới
  async createOrder(dto: CreateOrderDto, createdById: string): Promise<OrderResponse> {
    // Check and create self customer if not exists
    await this.ensureSelfCustomerExists(dto.userId);

    let actualCreatorId = createdById;
    
    if (createdById === dto.userId) {
      const recentCollabOrder = await this.orderRepo.createQueryBuilder("order")
        .where("order.userId = :userId", { userId: dto.userId })
        .andWhere("order.createdById != :userId", { userId: dto.userId })
        .orderBy("order.createdAt", "DESC")
        .getOne();

      if (recentCollabOrder && recentCollabOrder.createdById) {
        actualCreatorId = recentCollabOrder.createdById;
        this.logger.log(`User ${createdById} is creating an order. Auto-assigning to recent collaborator ${actualCreatorId}`);
      }
    }

    const order = this.orderRepo.create({
      ...dto,
      createdById: actualCreatorId,
    });

    if (dto.workId) {
      const linkedWork = await this.workRepo.findOne({ where: { id: dto.workId + "" } });
      if (linkedWork && linkedWork.exportDate) {
        order.exportDate = linkedWork.exportDate;
      }
    }

    const customer = await this.customerRepo.findOne({ where: { userCustomId: dto.userId } });
    if (!customer) {
      const user = await this.userRepo.findOne({ where: { id: dto.userId } });

      if (user) {
        await this.customerRepo.save({
          name: user.fullName || user.username,
          userId: createdById,
          userCustomId: dto.userId,
          isSelfCustomer: true,
          isActive: true,
        });
      }
    }

    const saved = await this.orderRepo.save(order);

    // Sync exportDate and purchaseQuantity (SUM) if workId is provided
    if (saved.workId) {
      await this.syncWorkInfo(saved.workId);
    }

    // Cập nhật monthly payout cho user
    if (saved.userId) {
      await this.updateMonthlyPayout(saved.userId);
    }

    this.logger.log(`Order created with ID ${saved.id}`);
    return this.buildResponse(saved, {}, HttpStatus.CREATED);
  }

  // 🟧 Cập nhật
  async updateOrder(id: number, dto: UpdateOrderDto): Promise<OrderResponse> {
    const order = await this.orderRepo.findOne({ where: { id: id + "" } });
    if (!order) throw new NotFoundException(`Order with ID ${id} not found`);

    const oldWorkId = order.workId;
    const oldUserId = order.userId;
    Object.assign(order, dto);

    if (dto.workId && dto.workId !== oldWorkId) {
      const linkedWork = await this.workRepo.findOne({ where: { id: dto.workId + "" } });
      if (linkedWork && linkedWork.exportDate) {
        order.exportDate = linkedWork.exportDate;
      }
    }

    const updated = await this.orderRepo.save(order);

    // Sync work info for both old and new work batches
    if (oldWorkId) await this.syncWorkInfo(oldWorkId);
    if (updated.workId && updated.workId !== oldWorkId) await this.syncWorkInfo(updated.workId);

    // Cập nhật monthly payout cho both old và new user nếu userId thay đổi
    if (oldUserId && oldUserId !== updated.userId) {
      await this.updateMonthlyPayout(oldUserId);
    }
    if (updated.userId) {
      await this.updateMonthlyPayout(updated.userId);
    }

    this.logger.log(`Order updated with ID ${id}`);
    return this.buildResponse(updated, {}, HttpStatus.OK);
  }

  // 🟥 Xóa
  async deleteOrder(id: number, requestingUser?: User): Promise<OrderResponse> {
    const order = await this.orderRepo.findOne({ where: { id: id + "" } });
    if (!order) throw new NotFoundException(`Order with ID ${id} not found`);

    let isNormalUser = false;
    let isCollaborator = false;
    if (requestingUser) {
      const fullUser = await this.userRepo.findOne({ where: { id: requestingUser.id }, relations: ["role"] });
      const roleCode = fullUser?.role?.code || '';
      isNormalUser = roleCode === 'USER' || roleCode === 'CUSTOMER';
      isCollaborator = roleCode === 'COLLABORATOR';
    }

    const isRestricted = isNormalUser || isCollaborator;
    const blockedStatuses: string[] = ['DA_HOAN_THANH', 'DA_DUYET'];

    if (isRestricted && blockedStatuses.includes(order.status || '')) {
      const label = order.status === 'DA_HOAN_THANH' ? 'đã hoàn thành' : 'đã được duyệt';
      throw new BadRequestException(`Không thể thao tác trên đơn hàng ${label}!`);
    }

    if (isRestricted) {
      order.status = OrderProposalStatusEnum.HUY_DON;
      const updated = await this.orderRepo.save(order);
      
      if (updated.workId) await this.syncWorkInfo(updated.workId);
      if (updated.userId) await this.updateMonthlyPayout(updated.userId);

      this.logger.log(`Order ${id} cancelled by user/collaborator`);
      return {
        statusCode: HttpStatus.OK,
        data: undefined,
        message: "Đơn hàng đã được chuyển sang trạng thái Hủy đơn." as any,
      };
    }

    const workId = order.workId;
    const userId = order.userId;
    await this.orderRepo.remove(order);

    if (workId) await this.syncWorkInfo(workId);
    if (userId) await this.updateMonthlyPayout(userId);

    this.logger.log(`Order deleted with ID ${id}`);
    return {
      statusCode: HttpStatus.OK,
      data: undefined,
      message: SuccessCode.SUCCESS,
    };
  }

  private async syncWorkInfo(workId: string) {
    try {
      const linkedWork = await this.workRepo.findOne({ where: { id: workId + "" } });

      if (!linkedWork) return;

      // 1. Calculate SUM of quantities from all orders linked to this work
      const orders = await this.orderRepo.find({ where: { workId: workId + "" } });
      const totalQuantity = orders.reduce((sum, o) => sum + (Number(o.quantity) || 0), 0);

      // 2. Update work batch
      linkedWork.purchaseQuantity = totalQuantity;

      // 3. Sync exportDate if work doesn't have one or if we want to ensure consistency
      // (Optional: but keeping it for consistency if that's the primary date source)
      // Note: Usually exportDate in order should come FROM work, not vice versa.
      // But we already have logic to sync order.exportDate = work.exportDate in the service steps.

      await this.workRepo.save(linkedWork);
      this.logger.log(`Synced Work batch ${workId}: Total Quantity = ${totalQuantity}`);
    } catch (err) {
      this.logger.error(`Error syncing work info for ID ${workId}:`, err);
    }
  }

  // 💰 Tính toán và cập nhật monthly payout cho user
  private async updateMonthlyPayout(userId: string): Promise<void> {
    try {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1; // getMonth() returns 0-11
      const currentYear = currentDate.getFullYear();

      const orders = await this.orderRepo
        .createQueryBuilder("order")
        .where("order.userId = :userId", { userId })
        .andWhere("EXTRACT(MONTH FROM order.orderDate) = :month", { month: currentMonth })
        .andWhere("EXTRACT(YEAR FROM order.orderDate) = :year", { year: currentYear })
        .getMany();

      const user = await this.userRepo.findOne({ where: { id: userId } });
      if (!user) return;

      const totalQuantity = orders.reduce((sum, order) => sum + (Number(order.quantity) || 0), 0);
      const totalAmount = orders.reduce((sum, order) => sum + (Number(order.amount) || 0), 0);
      const percentage = Number(user.percentage || 0);
      const actualRevenue = totalAmount * (percentage / 100);

      await this.monthlyPayoutService.savePayout({
        userId: userId,
        month: currentMonth,
        year: currentYear,
        isPaid: false,
        totalQuantity,
        percentage,
        actualRevenue,
      });

      this.logger.log(`Updated monthly payout for user ${userId}: totalQuantity=${totalQuantity}, percentage=${percentage}, actualRevenue=${actualRevenue}`);
    } catch (error) {
      this.logger.error(`Failed to update monthly payout for user ${userId}:`, error);
    }
  }

  async getSchedule(dateStr?: string): Promise<any> {
    const targetDate = dateStr ? new Date(dateStr) : new Date();
    // Normalize to YYYY-MM-DD for comparison
    const targetDateStr = targetDate.toISOString().split("T")[0];

    // 1. Fetch current day orders
    const currentOrders = await this.orderRepo
      .createQueryBuilder("order")
      .leftJoinAndSelect("order.user", "user")
      .leftJoinAndSelect("order.work", "work")
      .where("DATE(order.exportDate) = :date", { date: targetDateStr })
      .getMany();

    // 2. Find next available date
    const nextDateResult = await this.orderRepo
      .createQueryBuilder("order")
      .select("DATE(order.exportDate)", "nextDate")
      .where("DATE(order.exportDate) > :date", { date: targetDateStr })
      .orderBy("order.exportDate", "ASC")
      .limit(1)
      .getRawOne();

    // 3. Find previous available date
    const prevDateResult = await this.orderRepo
      .createQueryBuilder("order")
      .select("DATE(order.exportDate)", "prevDate")
      .where("DATE(order.exportDate) < :date", { date: targetDateStr })
      .orderBy("order.exportDate", "DESC")
      .limit(1)
      .getRawOne();

    let nextOrders: Order[] = [];
    let nextDate = null;
    let prevDate = null;

    if (nextDateResult && nextDateResult.nextDate) {
      nextDate = nextDateResult.nextDate;
      const nextDateStr = new Date(nextDate).toISOString().split("T")[0];
      nextOrders = await this.orderRepo
        .createQueryBuilder("order")
        .leftJoinAndSelect("order.user", "user")
        .leftJoinAndSelect("order.work", "work")
        .where("DATE(order.exportDate) = :date", { date: nextDateStr })
        .getMany();
    }

    if (prevDateResult && prevDateResult.prevDate) {
      prevDate = prevDateResult.prevDate;
    }

    return {
      statusCode: HttpStatus.OK,
      data: {
        current: {
          date: targetDateStr,
          orders: currentOrders.map((o) => this.toDto(o)),
        },
        next: {
          date: nextDate,
          orders: nextOrders.map((o) => this.toDto(o)),
        },
        prevDate: prevDate,
      },
      message: SuccessCode.SUCCESS,
    };
  }

  // 🔧 Đảm bảo user có customer record tự động tạo
  private async ensureSelfCustomerExists(userId: string): Promise<void> {
    try {
      // Check if self customer already exists
      const existingSelfCustomer = await this.customerService.findOne({
        where: { userId, isSelfCustomer: true },
      });

      if (existingSelfCustomer) {
        this.logger.log(`Self customer already exists for user ${userId}`);
        return;
      }

      // Get user info to create self customer
      const user = await this.userRepo.findOne({ where: { id: userId } });
      if (!user) {
        this.logger.warn(`User ${userId} not found when creating self customer`);
        return;
      }

      // Create self customer
      const createCustomerDto = {
        name: user.fullName || user.username,
        email: user.email,
        phone: user.phone,
        userId: userId,
        isSelfCustomer: true,
        isActive: true,
        note: "Khách hàng tự động tạo cho user",
      };

      await this.customerService.createCustomer(createCustomerDto, userId);
      this.logger.log(`Created self customer for user ${userId}`);
    } catch (error) {
      this.logger.error(`Failed to create self customer for user ${userId}:`, error);
      // Don't throw error to avoid breaking order creation
    }
  }
}
