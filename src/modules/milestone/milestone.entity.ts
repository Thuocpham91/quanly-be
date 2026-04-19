import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { BaseAuditEntity } from "@common/entity/base-audit.entity";

@Entity({ name: "MILESTONE", schema: "public" })
export class Milestone extends BaseAuditEntity {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id!: string;

  @Column({ type: "numeric", precision: 20, scale: 2 })
  targetAmount!: number;

  @Column({ type: "numeric", precision: 20, scale: 2 })
  bonusAmount!: number;

  @Column({ type: "varchar", length: 500, nullable: true })
  title?: string;

  @Column({ type: "boolean", default: true })
  isActive!: boolean;
}
