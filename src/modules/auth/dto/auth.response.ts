import { ApiProperty } from "@nestjs/swagger";
import { BaseResponse } from "@common/dtos/base-response.dto";
import { GenderEnum } from "@common/enum/psvn-enum";

export class AuthResponseDataDto {
  @ApiProperty({ example: "1" })
  id: string;

  @ApiProperty({ example: "john_doe" })
  username: string;

  @ApiProperty({ example: "John Doe" })
  fullName: string;

  @ApiProperty({ example: "john@example.com" })
  email: string;

  @ApiProperty({ example: "+84901234567", required: false })
  phone?: string;

  @ApiProperty({ enum: GenderEnum, required: false })
  gender?: GenderEnum;

  @ApiProperty({ required: false })
  avatar?: string;

  @ApiProperty({ required: false, description: "Vai trò của người dùng" })
  role?: any;

  @ApiProperty({ example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." })
  accessToken: string;
}

export class AuthResponse extends BaseResponse<AuthResponseDataDto> {
  @ApiProperty({ type: AuthResponseDataDto })
  data?: AuthResponseDataDto;
}
