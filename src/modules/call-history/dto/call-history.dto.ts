import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateCallHistoryDto {
  @ApiProperty({ description: "ID of the customer being called" })
  @IsNotEmpty()
  @IsString()
  customerId!: string;

  @ApiPropertyOptional({ description: "Optional note about the call" })
  @IsOptional()
  @IsString()
  note?: string;
}

export class SearchCallHistoryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  customerId?: string;
}
