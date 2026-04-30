import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { BaseAuditEntity } from "@common/entity/base-audit.entity";
import { User } from "../user/user.entity";

@Entity({ name: "customers", schema: "public" })
export class Customer extends BaseAuditEntity {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id!: string;

  @Column({ type: "varchar", length: 255 })
  name!: string;

  @Column({ type: "varchar", length: 255, nullable: true, unique: true })
  email?: string;

  @Column({ type: "varchar", length: 50, nullable: true })
  phone?: string;

  @Column({ type: "varchar", length: 500, nullable: true })
  address?: string;

  @Column({ type: "text", nullable: true })
  note?: string;

  @Column({ type: "boolean", default: true })
  isActive: boolean = true;

  // ── Quan hệ với User ──
  @Column({ type: "bigint", nullable: false, name: "userId" })
  userId!: string;

  @ManyToOne(() => User, { eager: false, onDelete: "CASCADE" })
  @JoinColumn({ name: "userId", referencedColumnName: "id" })
  user?: User;

  @Column({ type: "bigint", nullable: false, name: "userCustomId" })
  userCustomId!: string;

  @ManyToOne(() => User, { eager: false, onDelete: "CASCADE" })
  @JoinColumn({ name: "userCustomId", referencedColumnName: "id" })
  userCustom?: User;

  @Column("simple-array", { nullable: true })
  editorIds?: string[];

  @Column({ type: "boolean", default: false })
  isSelfCustomer: boolean = false;

  @Column({ type: "numeric", precision: 10, scale: 7, nullable: true })
  lat?: number;

  @Column({ type: "numeric", precision: 10, scale: 7, nullable: true })
  lng?: number;
}
