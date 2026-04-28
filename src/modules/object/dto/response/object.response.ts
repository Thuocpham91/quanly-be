import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { ObjectType } from "../../object.entity";

export class ObjectResponseDto {
  @ApiProperty()
  @Expose()
  id!: string;

  @ApiProperty()
  @Expose()
  name!: string;

  @ApiProperty({ description: "Object start date" })
  @Expose()
  startDate!: Date;

  @ApiPropertyOptional()
  @Expose()
  description?: string;

  @ApiPropertyOptional({ enum: ObjectType })
  @Expose()
  type?: ObjectType;

  @ApiPropertyOptional()
  @Expose()
  quantity?: number;
}

export interface ObjectResponse {
  statusCode: number;
  data: ObjectResponseDto | null;
  message: string;
}

export interface ObjectListResponse {
  statusCode: number;
  data: ObjectResponseDto[];
  total?: number;
  message: string;
}
