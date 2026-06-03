import { IsNotEmpty, IsOptional, IsString, IsIn } from "class-validator";
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

export type CallFilterType =
  | "ALL"
  | "NOT_CALLED"
  | "CALLED_10"
  | "CALLED_60"
  | "NO_CALL_10"
  | "NO_CALL_60"
  | "NO_CALL_5M";

export class CallStatusFilterDto {
  @ApiPropertyOptional({
    description: "Filter customers by call status",
    enum: ["ALL", "NOT_CALLED", "CALLED_10", "CALLED_60", "NO_CALL_10", "NO_CALL_60", "NO_CALL_5M"],
  })
  @IsOptional()
  @IsIn(["ALL", "NOT_CALLED", "CALLED_10", "CALLED_60", "NO_CALL_10", "NO_CALL_60", "NO_CALL_5M"])
  callFilter?: CallFilterType;
}
