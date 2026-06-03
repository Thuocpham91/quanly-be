import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { BaseAuditEntity } from "@common/entity/base-audit.entity";
import { OrderTypeEnum, OrderProposalStatusEnum } from "@common/enum/psvn-enum";
import { User } from "../user/user.entity";
import { Work } from "../work/work.entity";

@Entity({ name: "ORDER", schema: "public" })
export class Order extends BaseAuditEntity {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id!: string;

  @Column({ type: "bigint", name: "userId" })
  userId!: string;

  @ManyToOne(() => User, { eager: false })
  @JoinColumn({ name: "userId" })
  user?: User;

  @Column({ type: "bigint", name: "createdById", nullable: true })
  createdById?: string;

  @ManyToOne(() => User, { eager: false })
  @JoinColumn({ name: "createdById" })
  creator?: User;

  @Column({ type: "int", default: 0 })
  quantity!: number;

  @Column({
    type: "enum",
    enum: OrderTypeEnum,
    default: OrderTypeEnum.DAT_GA,
  })
  type?: OrderTypeEnum;

  @Column({
    type: "enum",
    enum: OrderProposalStatusEnum,
    default: OrderProposalStatusEnum.CHO_DUYET,
  })
  status?: OrderProposalStatusEnum;

  @Column({ type: "timestamp with time zone", nullable: true })
  orderDate?: Date;

  @Column({ type: "timestamp with time zone", nullable: true })
  exportDate?: Date;

  @Column({ type: "timestamp with time zone", nullable: true })
  saleDate?: Date;

  @Column({ type: "bigint", name: "workId", nullable: true })
  workId?: string;

  @ManyToOne(() => Work, (work) => work.orders, { eager: false, onDelete: "SET NULL" })
  @JoinColumn({ name: "workId" })
  work?: Work;

  @Column({ type: "numeric", precision: 20, scale: 2, default: 0 })
  amount?: number;

  @Column({ type: "numeric", precision: 20, scale: 2, default: 0 })
  unitPrice?: number;

  @Column({ type: "numeric", precision: 20, scale: 2, default: 0, nullable: true })
  priceGaSo?: number;

  @Column({ type: "numeric", precision: 20, scale: 2, default: 0, nullable: true })
  priceGaTrong?: number;

  @Column({ type: "numeric", precision: 20, scale: 2, default: 0, nullable: true })
  priceGaMai?: number;

  @Column({ type: "int", default: 0, nullable: true })
  gaSo?: number;

  @Column({ type: "int", default: 0, nullable: true })
  gaTrong?: number;

  @Column({ type: "int", default: 0, nullable: true })
  gaMai?: number;

  @Column({ type: "text", nullable: true })
  description?: string;

  @Column({ type: "bigint", name: "deliveryStaffId", nullable: true })
  deliveryStaffId?: string;

  @ManyToOne(() => User, { eager: false, onDelete: "SET NULL" })
  @JoinColumn({ name: "deliveryStaffId" })
  deliveryStaff?: User;
}

