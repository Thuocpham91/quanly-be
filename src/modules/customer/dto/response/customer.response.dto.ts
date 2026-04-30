import { Expose } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class CustomerResponseDto {
  @Expose()
  @ApiProperty({ example: "1" })
  id!: string;

  @Expose()
  @ApiProperty({ example: "Công ty ABC" })
  name!: string;

  @Expose()
  @ApiProperty({ example: "contact@abc.com", required: false })
  email?: string;

  @Expose()
  @ApiProperty({ example: "+84901234567", required: false })
  phone?: string;

  @Expose()
  @ApiProperty({ example: "Số 1, đường A, Quận B", required: false })
  address?: string;

  @Expose()
  @ApiProperty()
  userCustomId?: string;

  @Expose()
  @ApiProperty({ example: "Khách hàng mua theo hợp đồng năm 2026", required: false })
  note?: string;

  @Expose()
  @ApiProperty({ example: "2026-01-01T00:00:00.000Z" })
  createdAt!: Date;

  @Expose()
  @ApiProperty({ example: "2026-01-02T00:00:00.000Z" })
  updatedAt!: Date;

  @Expose()
  @ApiProperty()
  userId?: string;

  @Expose()
  @ApiProperty({ type: [String] })
  editorIds?: string[];
}
