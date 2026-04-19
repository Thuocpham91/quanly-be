import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString, IsBoolean } from "class-validator";

export class CreateMilestoneDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  targetAmount!: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  bonusAmount!: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  title?: string;
  
  @ApiProperty({ required: false, default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UpdateMilestoneDto {
  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  targetAmount?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  bonusAmount?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
