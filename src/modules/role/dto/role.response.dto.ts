import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class RoleResponseDto {
  @Expose()
  @ApiProperty({ example: "1" })
  id: string;

  @Expose()
  @ApiProperty({ example: "ADMIN" })
  code: string;

  @Expose()
  @ApiProperty({ example: "Quản trị viên" })
  name: string;

  @Expose()
  @ApiProperty({ required: false })
  description?: string;

  @Expose()
  @ApiProperty({ example: true })
  isActive: boolean;

  @Expose()
  @ApiProperty()
  createdAt: Date;

  @Expose()
  @ApiProperty()
  updatedAt: Date;
}
