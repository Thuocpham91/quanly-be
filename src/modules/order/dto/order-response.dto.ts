import { OrderTypeEnum, OrderProposalStatusEnum } from "@common/enum/psvn-enum";
import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { UserResponseDto } from "../../user/dto/response/user.response.dto";
import { WorkResponseDto } from "../../work/dto/response/work.response";

export class OrderResponseDto {
  @Expose()
  @ApiProperty()
  id: string;

  @Expose()
  @ApiProperty()
  userId: string;

  @Expose()
  @ApiProperty()
  quantity: number;

  @Expose()
  @ApiProperty({ enum: OrderTypeEnum })
  type: OrderTypeEnum;

  @Expose()
  @ApiProperty({ enum: OrderProposalStatusEnum })
  status: OrderProposalStatusEnum;

  @Expose()
  @ApiProperty()
  orderDate: Date;

  @Expose()
  @ApiProperty()
  exportDate?: Date;

  @Expose()
  @ApiProperty()
  saleDate?: Date;

  @Expose()
  @ApiProperty()
  createdAt: Date;

  @Expose()
  @ApiProperty()
  updatedAt: Date;

  @Expose()
  @ApiProperty()
  createdById?: string;

  @Expose()
  @ApiProperty()
  userId?: string;

  @Expose()
  @ApiProperty()
  @Type(() => UserResponseDto)
  user?: UserResponseDto;

  @Expose()
  @ApiProperty()
  @Type(() => UserResponseDto)
  creator?: UserResponseDto;

  @Expose()
  @ApiProperty()
  workId?: string;

  @Expose()
  @ApiProperty()
  work?: any;

  @Expose()
  @ApiProperty()
  amount?: number;

  @Expose()
  @ApiProperty()
  unitPrice?: number;

  @Expose()
  @ApiProperty()
  gaSo?: number;

  @Expose()
  @ApiProperty()
  gaTrong?: number;

  @Expose()
  @ApiProperty()
  gaMai?: number;

  @Expose()
  @ApiProperty()
  priceGaSo?: number;

  @Expose()
  @ApiProperty()
  priceGaTrong?: number;

  @Expose()
  @ApiProperty()
  priceGaMai?: number;

  @Expose()
  @ApiProperty()
  description?: string;
}
