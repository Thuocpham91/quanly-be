import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString, IsBoolean } from "class-validator";

export class CreateQrConfigDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  bankCode!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  bankName!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  bankAccount!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  accountName!: string;

  @ApiProperty({ required: false, default: "compact" })
  @IsString()
  @IsOptional()
  template?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  quickAmount?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false, default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UpdateQrConfigDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  bankCode?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  bankName?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  bankAccount?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  accountName?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  template?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  quickAmount?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
