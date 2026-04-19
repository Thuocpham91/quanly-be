import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export abstract class BaseAuditDto {
  @Expose()
  @ApiProperty({ example: "2025-08-10T12:00:00.000Z" })
  createdAt: Date;

  @Expose()
  createdBy?: string;

  @Expose()
  @ApiProperty({ example: "2025-08-11T09:30:00.000Z" })
  updatedAt: Date;

  @Expose()
  updatedBy?: string;

  @Expose()
  @ApiProperty({ example: "2025-08-11T09:30:00.000Z" })
  deletedAt: Date;

  @Expose()
  deletedBy?: string;
}
