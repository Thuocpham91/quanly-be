import { GenderEnum, UserStatusEnum } from "@common/enum/psvn-enum";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { RoleResponseDto } from "../../../role/dto/role.response.dto";

export class UserResponseDto {
  @Expose()
  id: string;

  @Expose()
  fullName: string;

  @Expose()
  username: string;

  @Expose()
  email: string;

  @Expose()
  phone?: string;

  @Expose()
  dateOfBirth?: string;

  @Expose()
  gender?: GenderEnum;

  @Expose()
  avatar?: string;

  @Expose()
  status: UserStatusEnum;

  @Expose()
  roleId: string;

  @Expose()
  @Type(() => RoleResponseDto)
  role?: RoleResponseDto;

  @Expose()
  keycloakId: string;

  @Expose()
  @ApiProperty({ type: String, isArray: true })
  permissions: string[];

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  lat?: number;

  @Expose()
  @ApiPropertyOptional()
  bankAccountName?: string;

  @Expose()
  @ApiPropertyOptional()
  bankName?: string;

  @Expose()
  @ApiPropertyOptional()
  bankCode?: string;

  @Expose()
  @ApiPropertyOptional()
  percentage?: number;

  @Expose()
  lng?: number;
}

export class UserRevenueDto {
  @Expose()
  @ApiProperty()
  id: string;

  @Expose()
  @ApiProperty()
  fullName: string;

  @Expose()
  @ApiProperty()
  username: string;

  @Expose()
  @ApiProperty()
  percentage?: number;

  @Expose()
  @ApiProperty({ description: "Total amount from all orders" })
  totalOrderAmount: number;

  @Expose()
  @ApiProperty({ description: "Actual revenue = totalOrderAmount * percentage / 100" })
  actualRevenue: number;

  @Expose()
  @ApiProperty({ description: "Number of orders" })
  orderCount: number;
}

export class UserAuthDto {
  @Expose()
  @ApiProperty()
  username: string;

  @Expose()
  @ApiProperty()
  fullName: string;

  @Expose()
  @ApiProperty()
  id: string;

  @Expose()
  @ApiProperty()
  email: string;

  @Expose()
  @ApiProperty()
  phone: string;

  @Expose()
  @ApiProperty()
  token: string;

  @Expose()
  @ApiProperty()
  dateOfBirth: Date;

  @Expose()
  @ApiProperty()
  avatar: string;

  @Expose()
  @ApiProperty({ enum: GenderEnum })
  gender: GenderEnum;

  @Expose()
  @ApiProperty({ type: String, isArray: true, example: ["123", "1232"] })
  permissions: string[];

  @Expose()
  @ApiProperty()
  lat?: number;

  @Expose()
  @ApiPropertyOptional()
  percentage?: number;

  @Expose()
  @ApiProperty()
  lng?: number;
}

export class UserResponseGroupDto {
  @Expose()
  id: string;

  @Expose()
  fullName: string;

  @Expose()
  username: string;

  @Expose()
  email: string;
}
