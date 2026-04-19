import { ApiProperty } from "@nestjs/swagger";
import { BaseResponse } from "./base-response.dto";
import { Expose } from "class-transformer";

export class PaginationMeta {
  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ example: 100 })
  total: number;

  @ApiProperty({ example: 10 })
  totalPages: number;
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
}

// export class PaginatedResponse<T> extends BaseResponse<T[]> {
//   @ApiProperty({ type: PaginationMeta })
//   meta: PaginationMeta;

//   constructor(statusCode: number, message: string, data: T[], page: number, limit: number, totalItems: number) {
//     super(statusCode, message, data);
//     this.meta = {
//       page,
//       limit,
//       totalItems,
//       totalPages: Math.ceil(totalItems / limit),
//     };
//   }
// }
