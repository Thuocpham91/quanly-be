import { ApiProperty } from "@nestjs/swagger";
import { PaginationMeta } from "./paginated-response.dto";

export interface Response<T> {
  error?: boolean;
  statusCode?: number;
  message?: string;
  data?: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
  };
}

export class BaseResponse<T> {
  @ApiProperty({ example: false })
  error?: boolean;

  @ApiProperty({ example: 200 })
  statusCode?: number;

  @ApiProperty({ example: "Success" })
  message?: string;

  @ApiProperty({ required: false })
  data?: T;

  @ApiProperty()
  errorCode?: string = "SUCCESS";

  @ApiProperty({ type: PaginationMeta, required: false, nullable: true })
  pagination?: PaginationMeta;

  constructor(statusCode: number, message: string, data?: T, pagination?: PaginationMeta) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.pagination = pagination;
  }
}
