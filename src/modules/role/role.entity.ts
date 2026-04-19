import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { BaseAuditEntity } from "@common/entity/base-audit.entity";

@Entity({ name: "ROLE", schema: "public" })
export class Role extends BaseAuditEntity {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id: string;

  @Column({ type: "varchar", length: 100, unique: true })
  code: string;

  @Column({ type: "varchar", length: 255 })
  name: string;

  @Column({ type: "text", nullable: true })
  description?: string;

  @Column({ type: "boolean", default: true })
  isActive: boolean;
}
