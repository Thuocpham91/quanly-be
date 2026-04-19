import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsDateString, IsString } from "class-validator";
import { OrderTypeEnum, OrderProposalStatusEnum } from "@common/enum/psvn-enum";
import { BaseSearchDto } from "@common/dtos/base-search.dto";

export class CreateOrderDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userId!: string;

  @ApiProperty({ default: 1 })
  @IsNumber()
  @IsNotEmpty()
  quantity!: number;

  @ApiProperty({ enum: OrderTypeEnum, default: OrderTypeEnum.DAT_GA })
  @IsEnum(OrderTypeEnum)
  @IsNotEmpty()
  type!: OrderTypeEnum;

  @ApiProperty({ enum: OrderProposalStatusEnum, default: OrderProposalStatusEnum.CHO_DUYET })
  @IsEnum(OrderProposalStatusEnum)
  @IsOptional()
  status?: OrderProposalStatusEnum;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  orderDate?: string;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  exportDate?: string;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  saleDate?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  workId?: string;

  @IsNumber()
  @IsOptional()
  amount?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  unitPrice?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateOrderDto {
  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  quantity?: number;

  @ApiProperty({ enum: OrderTypeEnum, required: false })
  @IsEnum(OrderTypeEnum)
  @IsOptional()
  type?: OrderTypeEnum;

  @ApiProperty({ enum: OrderProposalStatusEnum, required: false })
  @IsEnum(OrderProposalStatusEnum)
  @IsOptional()
  status?: OrderProposalStatusEnum;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  orderDate?: string;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  exportDate?: string;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  saleDate?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  workId?: string;

  @IsNumber()
  @IsOptional()
  amount?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  unitPrice?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;
}

export class SearchOrderDto extends BaseSearchDto {
  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  date?: string;
}
