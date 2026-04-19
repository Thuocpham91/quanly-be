import { IsStringOrNumber } from "@core/decorators/validator.decorator";
import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional } from "class-validator";

export class PaginationParamsDto {
  @ApiProperty({ required: false })
  @IsStringOrNumber()
  @IsOptional()
  page: number;

  @ApiProperty({ required: false })
  @IsStringOrNumber()
  @IsOptional()
  limit: number;

  @ApiProperty({ required: false })
  @IsStringOrNumber()
  @IsOptional()
  skip: number;

  @ApiProperty({ required: false })
  @IsStringOrNumber()
  @IsOptional()
  take: number;
}

export class PaginationResponseDto {
  @ApiProperty()
  @IsNumber()
  page: number;

  @ApiProperty()
  @IsNumber()
  limit: number;

  @ApiProperty()
  @IsNumber()
  total: number;
}
