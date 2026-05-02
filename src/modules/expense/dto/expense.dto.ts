import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { Type } from "class-transformer";
import { BaseSearchDto } from "@common/dtos/base-search.dto";

export class CreateExpenseDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  amount!: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  paidAmount?: number;

  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  date!: Date;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  category!: string;

  @ApiProperty({ enum: ['INCOME', 'EXPENSE', 'DEBT'], default: 'EXPENSE' })
  @IsString()
  @IsOptional()
  type?: "INCOME" | "EXPENSE" | "DEBT";

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  workId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  orderId?: string;

  @ApiPropertyOptional({ enum: ['RECEIVABLE', 'PAYABLE'] })
  @IsString()
  @IsOptional()
  debtType?: "RECEIVABLE" | "PAYABLE";

  @ApiPropertyOptional({ enum: ['PENDING', 'PAID'] })
  @IsString()
  @IsOptional()
  debtStatus?: "PENDING" | "PAID";

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  debtorName?: string;

  @ApiPropertyOptional()
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  dueDate?: Date;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateExpenseDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  amount?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  paidAmount?: number;

  @ApiPropertyOptional()
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  date?: Date;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  category?: string;

  @ApiPropertyOptional({ enum: ['INCOME', 'EXPENSE', 'DEBT'] })
  @IsString()
  @IsOptional()
  type?: "INCOME" | "EXPENSE" | "DEBT";

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  workId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  orderId?: string;

  @ApiPropertyOptional({ enum: ['RECEIVABLE', 'PAYABLE'] })
  @IsString()
  @IsOptional()
  debtType?: "RECEIVABLE" | "PAYABLE";

  @ApiPropertyOptional({ enum: ['PENDING', 'PAID'] })
  @IsString()
  @IsOptional()
  debtStatus?: "PENDING" | "PAID";

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  debtorName?: string;

  @ApiPropertyOptional()
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  dueDate?: Date;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;
}

export class SearchExpenseDto extends BaseSearchDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  category?: string;

  @ApiPropertyOptional({ enum: ['INCOME', 'EXPENSE', 'DEBT'] })
  @IsString()
  @IsOptional()
  type?: "INCOME" | "EXPENSE" | "DEBT";

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  workId?: string;

  @ApiPropertyOptional({ enum: ['PENDING', 'PAID'] })
  @IsString()
  @IsOptional()
  debtStatus?: "PENDING" | "PAID";

  @ApiPropertyOptional({ enum: ['RECEIVABLE', 'PAYABLE'] })
  @IsString()
  @IsOptional()
  debtType?: "RECEIVABLE" | "PAYABLE";

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  fromDate?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  toDate?: string;
}
