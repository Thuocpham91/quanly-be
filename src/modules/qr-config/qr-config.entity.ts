import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { BaseAuditEntity } from "@common/entity/base-audit.entity";

@Entity({ name: "QR_CONFIG", schema: "public" })
export class QrConfig extends BaseAuditEntity {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id!: string;

  @Column({ type: "varchar", length: 100 })
  bankCode!: string;

  @Column({ type: "varchar", length: 255 })
  bankName!: string;

  @Column({ type: "varchar", length: 100 })
  bankAccount!: string;

  @Column({ type: "varchar", length: 255 })
  accountName!: string;

  @Column({ type: "varchar", length: 50, default: "compact" })
  template!: string;

  @Column({ type: "numeric", precision: 20, scale: 0, nullable: true })
  quickAmount?: number;

  @Column({ type: "varchar", length: 500, nullable: true })
  description?: string;

  @Column({ type: "boolean", default: true })
  isActive!: boolean;
}
