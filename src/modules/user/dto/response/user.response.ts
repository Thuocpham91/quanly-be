import { BaseResponse } from "@common/dtos/base-response.dto";
import { UserAuthDto, UserResponseDto } from "./user.response.dto";
import { ApiProperty } from "@nestjs/swagger";

export class UserResponse extends BaseResponse<UserResponseDto> {
  @ApiProperty({ type: UserResponseDto })
  data?: UserResponseDto;
}

export class UserListResponse extends BaseResponse<UserResponseDto[]> {
  @ApiProperty({ type: UserResponseDto, isArray: true })
  data?: UserResponseDto[];
}
