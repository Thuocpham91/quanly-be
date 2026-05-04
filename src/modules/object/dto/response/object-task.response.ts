import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class ObjectTaskResponseDto {
  @ApiProperty()
  @Expose()
  id!: string;

  @ApiProperty()
  @Expose()
  taskName!: string;

  @ApiProperty()
  @Expose()
  quantity!: number;

  @ApiProperty({ description: "Work date offset from object start date" })
  @Expose()
  workDate!: number;

  @ApiProperty({ description: "Computed scheduled date from object start date + workDate" })
  @Expose()
  scheduledDate!: Date;

  @ApiPropertyOptional()
  @Expose()
  removalCount?: number;

  @ApiPropertyOptional()
  @Expose()
  description?: string;

  @ApiPropertyOptional()
  @Expose()
  feedPerAnimal?: number;

  @ApiProperty()
  @Expose()
  isRecurring!: boolean;
}

export interface ObjectTaskResponse {
  statusCode: number;
  data: ObjectTaskResponseDto | null;
  message: string;
}

export interface ObjectTaskListResponse {
  statusCode: number;
  data: ObjectTaskResponseDto[];
  total?: number;
  message: string;
}
