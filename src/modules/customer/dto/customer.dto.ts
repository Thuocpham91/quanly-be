import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";
import { Type } from "class-transformer";
import { BaseSearchDto } from "@common/dtos/base-search.dto";

export class CreateCustomerDto {
  @ApiProperty({ example: "Công ty ABC" })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name!: string;

  @ApiProperty({ example: "contact@abc.com" })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ example: "+84901234567" })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  phone?: string;

  @ApiPropertyOptional({ example: "Số 1, đường A, Quận B" })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  address?: string;

  @ApiPropertyOptional({ example: "Khách hàng mua theo hợp đồng năm 2026" })
  @IsString()
  @IsOptional()
  note?: string;

  @ApiPropertyOptional({ example: "1" })
  @IsString()
  @IsOptional()
  userCustomId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  lat?: number;

  @ApiPropertyOptional()
  @IsOptional()
  lng?: number;

  @ApiPropertyOptional({ example: false })
  @IsBoolean()
  @IsOptional()
  isSelfCustomer?: boolean;
}

export class UpdateCustomerDto {
  @ApiPropertyOptional({ example: "Công ty ABC" })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  name?: string;

  @ApiPropertyOptional({ example: "contact@abc.com" })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ example: "+84901234567" })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  phone?: string;

  @ApiPropertyOptional({ example: "Số 1, đường A, Quận B" })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  address?: string;

  @ApiPropertyOptional({ example: "Khách hàng mua theo hợp đồng năm 2026" })
  @IsString()
  @IsOptional()
  note?: string;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  lat?: number;

  @ApiPropertyOptional()
  @IsOptional()
  lng?: number;

  @ApiPropertyOptional({ example: false })
  @IsBoolean()
  @IsOptional()
  isSelfCustomer?: boolean;
}

export class SearchCustomerDto extends BaseSearchDto {
  @ApiPropertyOptional({ description: "Trạng thái hoạt động của khách hàng" })
  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
