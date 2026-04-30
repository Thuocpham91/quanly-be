import { SortOrderEnum } from "@common/enum/psvn-enum";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEnum, IsNumber, IsOptional, IsString, Max, MaxLength, Min } from "class-validator";

export class BaseSearchDto {
  @ApiPropertyOptional({ description: "Từ khóa tìm kiếm", maxLength: 255 })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  keyword?: string;

  @ApiPropertyOptional({ description: "Trang hiện tại", default: 1 })
  @Type(() => Number)
  @IsNumber()
  @Min(1) // ✅ không cho page < 1
  @IsOptional()
  page: number = 1;

  @ApiPropertyOptional({ description: "Số bản ghi mỗi trang", default: 10 })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(1000)
  @IsOptional()
  limit: number = 10;

  @ApiPropertyOptional({ description: "Sắp xếp theo field" })
  @IsString()
  @IsOptional()
  sortBy?: string;

  @IsOptional()
  @IsEnum(SortOrderEnum)
  @ApiPropertyOptional({
    description: "Thứ tự sắp xếp",
    enum: SortOrderEnum,
    default: SortOrderEnum.ASC,
    example: SortOrderEnum.ASC,
  })
  sortOrder?: SortOrderEnum;
}
