import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { WorkResponseDto } from "../../../work/dto/response/work.response";

export class ExpenseResponseDto {
  @Expose()
  @ApiProperty()
  id!: string;

  @Expose()
  @ApiProperty()
  title!: string;

  @Expose()
  @ApiProperty()
  amount!: number;

  @Expose()
  @ApiProperty()
  date!: Date;

  @Expose()
  @ApiProperty()
  category!: string;

  @Expose()
  @ApiProperty({ enum: ['INCOME', 'EXPENSE'] })
  type!: "INCOME" | "EXPENSE";

  @Expose()
  @ApiPropertyOptional()
  workId?: string;

  @Expose()
  @Type(() => WorkResponseDto)
  @ApiPropertyOptional({ type: () => WorkResponseDto })
  work?: WorkResponseDto;

  @Expose()
  @ApiPropertyOptional()
  description?: string;

  @Expose()
  @ApiProperty()
  createdAt!: Date;
}

export class ExpenseListResponse {
  @ApiProperty({ type: [ExpenseResponseDto] })
  data!: ExpenseResponseDto[];

  @ApiProperty()
  total!: number;
}
