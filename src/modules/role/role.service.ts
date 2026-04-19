import { Injectable, NotFoundException, ConflictException, HttpStatus, Logger, OnModuleInit } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Role } from "./role.entity";
import { CreateRoleDto, UpdateRoleDto } from "./dto/role.dto";
import { RoleResponseDto } from "./dto/role.response.dto";
import { plainToInstance } from "class-transformer";
import { SuccessCode } from "@common/constans/message-code.enum";
import { BaseResponse } from "@common/dtos/base-response.dto";

export class RoleListResponse extends BaseResponse<RoleResponseDto[]> {}
export class RoleDetailResponse extends BaseResponse<RoleResponseDto> {}

@Injectable()
export class RoleService implements OnModuleInit {
  private readonly logger = new Logger(RoleService.name);

  constructor(
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
  ) {}

  async onModuleInit() {
    const standardRoles = [
      { code: 'ADMIN', name: 'Quản trị viên', isActive: true },
      { code: 'MANAGER', name: 'Quản lý', isActive: true },
      { code: 'STAFF', name: 'Nhân viên', isActive: true },
      { code: 'USER', name: 'Người dùng', isActive: true },
      { code: 'CUSTOMER', name: 'Khách hàng', isActive: true },
      { code: 'COLLABORATOR', name: 'Cộng tác viên', isActive: true }
    ];

    for (const roleDef of standardRoles) {
      const existing = await this.roleRepo.findOne({ where: { code: roleDef.code } });
      if (!existing) {
        await this.roleRepo.save(this.roleRepo.create(roleDef));
        this.logger.log(`Auto-seeded missing role: ${roleDef.name} (${roleDef.code})`);
      }
    }
  }

  private toDto(role: Role): RoleResponseDto {
    return plainToInstance(RoleResponseDto, role, { excludeExtraneousValues: true });
  }

  // 🟩 Lấy tất cả role
  async getAll(): Promise<RoleListResponse> {
    const roles = await this.roleRepo.find({ order: { createdAt: "DESC" } });
    return {
      statusCode: HttpStatus.OK,
      message: SuccessCode.SUCCESS,
      data: roles.map((r) => this.toDto(r)),
    };
  }

  // 🟦 Lấy chi tiết role theo id
  async getById(id: string): Promise<RoleDetailResponse> {
    const role = await this.roleRepo.findOne({ where: { id } });
    if (!role) throw new NotFoundException(`Role với ID ${id} không tồn tại`);
    return {
      statusCode: HttpStatus.OK,
      message: SuccessCode.SUCCESS,
      data: this.toDto(role),
    };
  }

  // 🟨 Tạo mới role
  async create(dto: CreateRoleDto): Promise<RoleDetailResponse> {
    const existing = await this.roleRepo.findOne({ where: { code: dto.code } });
    if (existing) throw new ConflictException(`Role code "${dto.code}" đã tồn tại`);

    const role = this.roleRepo.create(dto);
    const saved = await this.roleRepo.save(role);
    this.logger.log(`Role created: ${saved.code}`);
    return {
      statusCode: HttpStatus.CREATED,
      message: SuccessCode.SUCCESS,
      data: this.toDto(saved),
    };
  }

  // 🟧 Cập nhật role
  async update(id: string, dto: UpdateRoleDto): Promise<RoleDetailResponse> {
    const role = await this.roleRepo.findOne({ where: { id } });
    if (!role) throw new NotFoundException(`Role với ID ${id} không tồn tại`);

    Object.assign(role, dto);
    const updated = await this.roleRepo.save(role);
    this.logger.log(`Role updated: ${id}`);
    return {
      statusCode: HttpStatus.OK,
      message: SuccessCode.SUCCESS,
      data: this.toDto(updated),
    };
  }

  // 🟥 Xóa role
  async remove(id: string): Promise<RoleDetailResponse> {
    const role = await this.roleRepo.findOne({ where: { id } });
    if (!role) throw new NotFoundException(`Role với ID ${id} không tồn tại`);

    await this.roleRepo.softRemove(role);
    this.logger.log(`Role deleted: ${id}`);
    return {
      statusCode: HttpStatus.OK,
      message: SuccessCode.SUCCESS,
      data: null,
    };
  }
}
