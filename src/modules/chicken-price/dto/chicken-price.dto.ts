import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class CreateChickenPriceDto {
  @ApiProperty({ example: "2026-04-19" })
  @IsDateString()
  @IsNotEmpty()
  priceDate!: string;

  @ApiProperty({ example: 85000 })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  pricePerKg!: number;

  @ApiPropertyOptional({ example: 150000 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  pricePerHead?: number;

  @ApiPropertyOptional({ example: 151000 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  priceGaSo?: number;

  @ApiPropertyOptional({ example: 152000 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  priceGaTrong?: number;

  @ApiPropertyOptional({ example: 153000 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  priceGaMai?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  note?: string;
}

export class UpdateChickenPriceDto {
  @ApiPropertyOptional({ example: "2026-04-19" })
  @IsDateString()
  @IsOptional()
  priceDate?: string;

  @ApiPropertyOptional({ example: 85000 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  pricePerKg?: number;

  @ApiPropertyOptional({ example: 150000 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  pricePerHead?: number;

  @ApiPropertyOptional({ example: 151000 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  priceGaSo?: number;

  @ApiPropertyOptional({ example: 152000 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  priceGaTrong?: number;

  @ApiPropertyOptional({ example: 153000 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  priceGaMai?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  note?: string;
}
