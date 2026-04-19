import { BaseResponse } from "@common/dtos/base-response.dto";
import { OrderResponseDto } from "./order-response.dto";
import { ApiProperty } from "@nestjs/swagger";

export class OrderResponse extends BaseResponse<OrderResponseDto> {
  @ApiProperty({ type: OrderResponseDto })
  data?: OrderResponseDto;
}

export class OrderListResponse extends BaseResponse<OrderResponseDto[]> {
  @ApiProperty({ type: OrderResponseDto, isArray: true })
  data?: OrderResponseDto[];
}
