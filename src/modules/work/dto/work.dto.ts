import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsDate, IsInt, IsNotEmpty, IsOptional, IsString, IsArray } from "class-validator";
import { Type } from "class-transformer";
import { BaseSearchDto } from "@common/dtos/base-search.dto";

export class SearchWorkDto extends BaseSearchDto {
  @ApiPropertyOptional({ description: "Search by date (YYYY-MM-DD)" })
  @IsOptional()
  @IsString()
  date?: string;

  @ApiPropertyOptional({ description: "Search by ObjectId" })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  objectId?: number;
}

export class CreateWorkDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ description: "Object ID to create work from" })
  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  objectId!: number;

  @ApiProperty({ description: "Object start date as integer timestamp" })
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  startDate!: Date;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: "Work date" })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  workDate?: Date;

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  quantity?: number;

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  purchaseQuantity?: number;

  @ApiPropertyOptional()
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  removalCount?: number;

  @ApiPropertyOptional({ description: "Start from which day in object tasks" })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  startDay?: number;
}

export class UpdateWorkDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: "Work date" })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  workDate?: Date;

  @ApiPropertyOptional({ description: "Work start date" })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  startDate?: Date;

  @ApiPropertyOptional({ description: "Employee check status" })
  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  employeeChecked?: boolean;

  @ApiPropertyOptional({ description: "Manager check status" })
  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  managerChecked?: boolean;

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  quantity?: number;

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  purchaseQuantity?: number;

  @ApiPropertyOptional()
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  removalCount?: number;
}

export class CreateWorkTaskDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  taskName!: string;

  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  workId!: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  startDate!: Date;
}

export class UpdateWorkTaskDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  taskName?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional()
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  startDate?: Date;

  @ApiPropertyOptional()
  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  employeeChecked?: boolean;

  @ApiPropertyOptional()
  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  managerChecked?: boolean;

  @ApiPropertyOptional()
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  quantity?: number;

  @ApiPropertyOptional()
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  removalCount?: number;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  fileUrls?: string[];
}
export class SearchWorkTaskDto extends BaseSearchDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  workId?: string;

  @ApiPropertyOptional({ description: "Search by date (YYYY-MM-DD)" })
  @IsOptional()
  @IsString()
  startDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  employeeChecked?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  managerChecked?: boolean;
}
