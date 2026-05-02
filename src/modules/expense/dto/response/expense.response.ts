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
  paidAmount!: number;

  @Expose()
  @ApiProperty()
  date!: Date;

  @Expose()
  @ApiProperty()
  category!: string;

  @Expose()
  @ApiProperty({ enum: ['INCOME', 'EXPENSE', 'DEBT'] })
  type!: "INCOME" | "EXPENSE" | "DEBT";

  @Expose()
  @ApiPropertyOptional()
  workId?: string;

  @Expose()
  @Type(() => WorkResponseDto)
  @ApiPropertyOptional({ type: () => WorkResponseDto })
  work?: WorkResponseDto;

  @Expose()
  @ApiPropertyOptional({ enum: ['RECEIVABLE', 'PAYABLE'] })
  debtType?: "RECEIVABLE" | "PAYABLE";

  @Expose()
  @ApiPropertyOptional({ enum: ['PENDING', 'PAID'] })
  debtStatus?: "PENDING" | "PAID";

  @Expose()
  @ApiPropertyOptional()
  debtorName?: string;

  @Expose()
  @ApiPropertyOptional()
  dueDate?: Date;

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
