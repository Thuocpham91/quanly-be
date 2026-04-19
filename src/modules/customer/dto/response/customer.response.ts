import { BaseResponse } from "@common/dtos/base-response.dto";
import { CustomerResponseDto } from "./customer.response.dto";
import { ApiProperty } from "@nestjs/swagger";

export class CustomerResponse extends BaseResponse<CustomerResponseDto> {
  @ApiProperty({ type: CustomerResponseDto, required: false })
  data?: CustomerResponseDto;
}

export class CustomerListResponse extends BaseResponse<CustomerResponseDto[]> {
  @ApiProperty({ type: CustomerResponseDto, isArray: true, required: false })
  data?: CustomerResponseDto[];
}
