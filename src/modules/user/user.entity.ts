import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { BaseAuditEntity } from "@common/entity/base-audit.entity";
import { GenderEnum, UserStatusEnum } from "@common/enum/psvn-enum";
import { Role } from "../role/role.entity";

@Entity({ name: "users", schema: "public" })
export class User extends BaseAuditEntity {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id!: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  fullName!: string;

  @Column({ type: "varchar", length: 255, unique: true })
  username!: string;

  @Column({ type: "varchar", length: 255, unique: true, nullable: true })
  email?: string;

  @Column({ type: "varchar", length: 20, nullable: true })
  phone!: string;

  @Column({ type: "date", nullable: true })
  dateOfBirth?: Date;

  @Column({ type: "enum", enum: GenderEnum, default: GenderEnum.OTHER })
  gender: GenderEnum;

  @Column({ type: "varchar", nullable: true })
  avatar?: string;

  @Column({ type: "varchar", length: 255, nullable: true, select: false })
  password?: string;

  // ── Quan hệ với Role ──
  @Column({ type: "bigint", nullable: true, name: "roleId" })
  roleId?: string;

  @Column({ type: "numeric", precision: 10, scale: 7, nullable: true })
  lat?: number;

  @Column({ type: "numeric", precision: 10, scale: 7, nullable: true })
  lng?: number;

  @ManyToOne(() => Role, { eager: false, onDelete: "SET NULL" })
  @JoinColumn({ name: "roleId", referencedColumnName: "id" })
  role?: Role;

  @Column({ type: "varchar", length: 255, nullable: true })
  bankAccountName?: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  bankName?: string;

  @Column({ type: "varchar", length: 50, nullable: true })
  bankCode?: string;

  @Column({ type: "numeric", precision: 5, scale: 2, default: 0, nullable: true })
  percentage?: number;

  @Column({ type: "enum", enum: UserStatusEnum, default: UserStatusEnum.ACTIVE })
  status: UserStatusEnum;
}
