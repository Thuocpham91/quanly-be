import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsDateString,
  IsArray,
  ValidateNested,
} from "class-validator";
import { GenderEnum, UserStatusEnum } from "@common/enum/psvn-enum";
import { BaseSearchDto } from "@common/dtos/base-search.dto";
import { Transform, Type } from "class-transformer";

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ required: false })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  dateOfBirth?: string;

  @ApiProperty({ enum: GenderEnum, default: GenderEnum.OTHER })
  @IsEnum(GenderEnum)
  @IsOptional()
  gender?: GenderEnum;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  avatar?: string;

  @ApiProperty({ enum: UserStatusEnum, default: UserStatusEnum.ACTIVE })
  @IsEnum(UserStatusEnum)
  @IsOptional()
  status?: UserStatusEnum;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password!: string;

  @ApiProperty()
  @IsNotEmpty()
  roleId: string;

  @ApiPropertyOptional()
  @IsOptional()
  lat?: number;

  @ApiPropertyOptional()
  @IsOptional()
  lng?: number;

  @ApiPropertyOptional({ description: "Revenue percentage (0-100)" })
  @IsOptional()
  @Transform(({ value }) => (value ? Number(value) : undefined))
  percentage?: number;

  @ApiPropertyOptional({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  permissions?: string[];
}

export class UpdateUserDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  fullName?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  avatar?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  username?: string;

  @ApiProperty({ enum: GenderEnum, default: GenderEnum.OTHER })
  @IsEnum(GenderEnum)
  @IsOptional()
  gender?: GenderEnum;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  dateOfBirth?: string;

  @ApiProperty()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  bankAccountName?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  bankName?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  bankCode?: string;

  password?: string;

  @ApiPropertyOptional()
  @IsOptional()
  lat?: number;

  @ApiPropertyOptional()
  @IsOptional()
  lng?: number;

  @ApiPropertyOptional({ description: "Revenue percentage (0-100)" })
  @IsOptional()
  @Transform(({ value }) => (value ? Number(value) : undefined))
  percentage?: number;

  @ApiPropertyOptional({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  permissions?: string[];
}
export class UpdateRoleDto {
  @ApiProperty()
  @IsNotEmpty()
  roleId: string;
}
export class UpdateStatusDto {
  @ApiProperty()
  @IsNotEmpty()
  status: UserStatusEnum;
}

export class SearchUserDto extends BaseSearchDto {
  @IsEnum(UserStatusEnum, { each: true })
  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  status?: UserStatusEnum[];

  @IsOptional()
  userId?: number;

  @ApiPropertyOptional({
    description: "List mã nhóm role",
    type: [String],
    example: ["abc", "xyz"],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  roleIds?: string[];
}
export class AuthRequestDto {
  @ApiProperty({ required: false })
  @IsOptional()
  token?: string;
}
