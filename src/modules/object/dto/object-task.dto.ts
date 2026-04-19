import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Type } from "class-transformer";

export class CreateObjectTaskDto {
  @ApiProperty({ description: "Task title or name" })
  @IsString()
  @IsNotEmpty()
  taskName!: string;

  @ApiProperty({ description: "Quantity or amount related to the task" })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  quantity?: number;

  @ApiProperty({ description: "Work date for the task as integer timestamp" })
  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  workDate!: number;

  @ApiPropertyOptional({ description: "Optional removal count" })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  removalCount?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateObjectTaskDto {
  @ApiPropertyOptional({ description: "Task title or name" })
  @IsString()
  @IsOptional()
  taskName?: string;

  @ApiPropertyOptional({ description: "Quantity or amount related to the task" })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  quantity?: number;

  @ApiPropertyOptional({ description: "Work date for the task as integer timestamp" })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  workDate?: number;

  @ApiPropertyOptional({ description: "Optional removal count" })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  removalCount?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;
}
