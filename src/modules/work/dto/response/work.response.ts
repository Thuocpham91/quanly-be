import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { ObjectResponseDto } from "../../../object/dto/response/object.response";

import { WorkTaskResponseDto } from "./work-task.response";
import { OrderResponseDto } from "../../../order/dto/order-response.dto";

export class WorkResponseDto {
  @Expose()
  @ApiProperty()
  id!: string;

  @Expose()
  @ApiProperty()
  title!: string;

  @Expose()
  @ApiProperty()
  objectId!: string;

  @Expose()
  @ApiProperty()
  @Type(() => ObjectResponseDto)
  object?: ObjectResponseDto;

  @Expose()
  @ApiProperty()
  startDate!: Date;

  @Expose()
  @ApiPropertyOptional()
  description?: string;

  @Expose()
  @ApiPropertyOptional({ description: "Work date" })
  workDate?: Date;

  @Expose()
  @ApiPropertyOptional({ description: "Chicken export date" })
  exportDate?: Date;

  @Expose()
  @ApiPropertyOptional()
  quantity?: number;

  @Expose()
  @ApiPropertyOptional()
  purchaseQuantity?: number;

  @Expose()
  @ApiProperty({ type: () => [WorkTaskResponseDto] })
  @Type(() => WorkTaskResponseDto)
  workTasks!: WorkTaskResponseDto[];

  @Expose()
  @ApiProperty()
  status?: string;

  @Expose()
  @ApiProperty()
  orders?: any[];
}

export interface WorkResponse {
  statusCode: number;
  data: WorkResponseDto | null;
  message: string;
}

export interface WorkListResponse {
  statusCode: number;
  data: WorkResponseDto[];
  message: string;
}
