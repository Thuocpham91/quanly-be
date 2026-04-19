import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { BaseAuditEntity } from "@common/entity/base-audit.entity";
import { User } from "../user/user.entity";

@Entity({ name: "MONTHLY_PAYOUT", schema: "public" })
export class MonthlyPayout extends BaseAuditEntity {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id!: string;

  @Column({ type: "bigint", name: "userId" })
  userId!: string;

  @ManyToOne(() => User, { eager: false, onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user?: User;

  @Column({ type: "int" })
  month!: number;

  @Column({ type: "int" })
  year!: number;

  @Column({ type: "numeric", precision: 20, scale: 2, default: 0 })
  totalQuantity!: number;

  @Column({ type: "numeric", precision: 5, scale: 2, default: 0 })
  percentage!: number;

  @Column({ type: "numeric", precision: 20, scale: 2, default: 0 })
  actualRevenue!: number;

  @Column({ type: "boolean", default: false })
  isPaid!: boolean;
}
