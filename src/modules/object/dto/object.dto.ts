import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Type } from "class-transformer";
import { ObjectType } from "../object.entity";

export class CreateObjectDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ description: "Object start date as integer timestamp" })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  startDate?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ enum: ObjectType })
  @IsOptional()
  type?: ObjectType;

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  quantity?: number;
}

export class UpdateObjectDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: "Object start date as integer timestamp" })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  startDate?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ enum: ObjectType })
  @IsOptional()
  type?: ObjectType;

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  quantity?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  status?: string;
}
