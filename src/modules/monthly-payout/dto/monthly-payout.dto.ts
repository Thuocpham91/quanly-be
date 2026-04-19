import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsBoolean, IsOptional, IsString } from "class-validator";

export class SavePayoutDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userId!: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  month!: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  year!: number;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isPaid?: boolean;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  totalQuantity?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  percentage?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  actualRevenue?: number;
}
