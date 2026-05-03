import { Injectable, NotFoundException, HttpStatus, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { User } from "./user.entity";
import { UserResponseDto, UserRevenueDto } from "./dto/response/user.response.dto";
import { BaseService } from "@common/services/base.service";
import { SuccessCode } from "@common/constans/message-code.enum";
import { UserListResponse, UserResponse } from "./dto/response/user.response";
import { CreateUserDto, UpdateUserDto } from "./dto/user.dto";
import { Order } from "../order/order.entity";
import { RoleResponseDto } from "../role/dto/role.response.dto";
import { plainToInstance } from "class-transformer";

@Injectable()
export class UserService extends BaseService<User, UserResponseDto> {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
  ) {
    super(userRepo, UserResponseDto);
  }

  private buildResponse(entity: User, relationsMap?: Record<string, any>, statusCode?: HttpStatus): UserResponse {
    return {
      statusCode,
      data: this.toDto(entity, relationsMap),
      message: SuccessCode.SUCCESS,
    };
  }

  // 🟩 Lấy danh sách tất cả người dùng
  async getAll(): Promise<UserListResponse> {
    const users = await this.userRepo.find({ relations: ["role"] });
    return {
      statusCode: HttpStatus.OK,
      data: users.map((u) => this.toDto(u, { role: RoleResponseDto })),
      message: SuccessCode.SUCCESS,
    };
  }

  // 🟦 Lấy chi tiết theo id
  async getById(id: number): Promise<UserResponse> {
    const user = await this.userRepo.findOne({ where: { id: id + "" } });
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);

    return this.buildResponse(user, {}, HttpStatus.OK);
  }

  // 🟨 Tạo mới
  async createUser(dto: CreateUserDto): Promise<UserResponse> {
    // Hash password before saving
    const hashedPassword = dto.password ? await bcrypt.hash(dto.password, 10) : undefined;

    const entity = this.userRepo.create({
      ...dto,
      password: hashedPassword,
    });
    const saved = await this.userRepo.save(entity);
    const userWithRole = await this.userRepo.findOne({ where: { id: saved.id }, relations: ["role"] });
    this.logger.log(`User created with ID ${saved.id}`);

    return this.buildResponse(userWithRole, { role: RoleResponseDto }, HttpStatus.CREATED);
  }

  // 🟧 Cập nhật
  async updateUser(id: number, dto: UpdateUserDto): Promise<UserResponse> {
    const user = await this.userRepo.findOne({ where: { id: id + "" } });
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);

    // Hash password if provided
    if (dto.password && dto.password.trim() !== "") {
      user.password = await bcrypt.hash(dto.password, 10);
    }

    // Remove password from dto to avoid overwriting the hashed password or assigning undefined
    const { password, ...updateData } = dto;

    // Filter out undefined values to prevent overwriting existing data with undefined
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] !== undefined) {
        user[key] = updateData[key];
      }
    });

    const updated = await this.userRepo.save(user);
    const userWithRole = await this.userRepo.findOne({ where: { id: id + "" }, relations: ["role"] });

    this.logger.log(`User updated with ID ${id}`);
    return this.buildResponse(userWithRole, { role: RoleResponseDto }, HttpStatus.OK);
  }

  // 🟥 Xóa
  async deleteUser(id: number): Promise<UserResponse> {
    const user = await this.userRepo.findOne({ where: { id: id + "" } });
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);

    await this.userRepo.softRemove(user);
    this.logger.log(`User deleted with ID ${id}`);

    return {
      statusCode: HttpStatus.OK,
      data: null,
      message: SuccessCode.SUCCESS,
    };
  }

  // 💰 Tính doanh thu thực tế của user (Order Amount × Percentage / 100)
  async getUserRevenue(userId: number): Promise<{ statusCode: number; data: UserRevenueDto; message: string }> {
    const user = await this.userRepo.findOne({ where: { id: userId + "" } });
    if (!user) throw new NotFoundException(`User with ID ${userId} not found`);

    const orders = await this.orderRepo.find({ where: { userId: userId + "" } });

    const totalAmount = orders.reduce((sum, order) => {
      const amount = Number(order.amount || 0);
      return sum + (isNaN(amount) ? 0 : amount);
    }, 0);

    const percentage = Number(user.percentage || 0);
    const actualRevenue = totalAmount * (isNaN(percentage) ? 0 : percentage) / 100;

    const revenueDto = plainToInstance(UserRevenueDto, {
      id: user.id,
      fullName: user.fullName,
      username: user.username,
      percentage: isNaN(percentage) ? 0 : percentage,
      totalOrderAmount: totalAmount,
      actualRevenue,
      orderCount: orders.length,
    });

    return {
      statusCode: HttpStatus.OK,
      data: revenueDto,
      message: SuccessCode.SUCCESS,
    };
  }

  // 💰 Tính doanh thu thực tế của tất cả user
  async getAllUsersRevenue(): Promise<{
    statusCode: number;
    data: UserRevenueDto[];
    message: string;
  }> {
    const users = await this.userRepo.find();
    const revenueData: UserRevenueDto[] = [];

    for (const user of users) {
      const orders = await this.orderRepo.find({ where: { userId: user.id } });

      const totalAmount = orders.reduce((sum, order) => {
        const amount = Number(order.amount || 0);
        return sum + (isNaN(amount) ? 0 : amount);
      }, 0);

      const percentage = Number(user.percentage || 0);
      const actualRevenue = totalAmount * (isNaN(percentage) ? 0 : percentage) / 100;

      const revenueDto = plainToInstance(UserRevenueDto, {
        id: user.id,
        fullName: user.fullName,
        username: user.username,
        percentage: isNaN(percentage) ? 0 : percentage,
        totalOrderAmount: totalAmount,
        actualRevenue,
        orderCount: orders.length,
      });

      revenueData.push(revenueDto);
    }

    return {
      statusCode: HttpStatus.OK,
      data: revenueData,
      message: SuccessCode.SUCCESS,
    };
  }
}
