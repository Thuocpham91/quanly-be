import { BaseResponse } from "@common/dtos/base-response.dto";
import { ApiProperty } from "@nestjs/swagger";
import { UploadFileResponseDto } from "./upload-file.response.dto";

export class UploadFileResponse extends BaseResponse<UploadFileResponseDto> {
  @ApiProperty({ type: UploadFileResponseDto })
  data: UploadFileResponseDto;
}

export class UploadFileListResponse extends BaseResponse<UploadFileResponseDto[]> {
  @ApiProperty({ type: [UploadFileResponseDto] })
  data: UploadFileResponseDto[];
}
