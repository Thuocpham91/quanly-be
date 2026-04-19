import { ApiProperty } from "@nestjs/swagger";

export class PaginationMeta {
  @ApiProperty({ description: "Tổng số bản ghi" })
  total: number;

  @ApiProperty({ description: "Số bản ghi mỗi trang" })
  limit: number;

  @ApiProperty({ description: "Trang hiện tại" })
  page: number;

  @ApiProperty({ description: "Tổng số trang" })
  totalPages: number;
}

export class BaseSearchResponseDto<T> {
  @ApiProperty({ description: "Danh sách dữ liệu", isArray: true })
  data: T[];

  @ApiProperty({ description: "Thông tin phân trang" })
  meta: PaginationMeta;

  constructor(data: T[], total: number, limit: number, page: number) {
    this.data = data;
    this.meta = {
      total,
      limit,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }
}
