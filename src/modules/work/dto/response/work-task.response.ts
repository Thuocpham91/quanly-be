import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { WorkResponseDto } from "./work.response";

export class WorkTaskResponseDto {
  @Expose()
  @ApiProperty()
  id!: string;

  @Expose()
  @ApiProperty()
  taskName!: string;

  @Expose()
  @ApiPropertyOptional()
  description?: string;

  @Expose()
  @ApiProperty()
  startDate!: Date;

  @Expose()
  @ApiProperty()
  employeeChecked!: boolean;

  @Expose()
  @ApiProperty()
  managerChecked!: boolean;

  @Expose()
  @ApiPropertyOptional()
  quantity?: number;

  @Expose()
  @ApiPropertyOptional()
  removalCount?: number;

  @Expose()
  @ApiProperty()
  workId!: string;

  @Expose()
  @ApiPropertyOptional({ type: () => WorkResponseDto })
  @Type(() => WorkResponseDto)
  work?: WorkResponseDto;
}
