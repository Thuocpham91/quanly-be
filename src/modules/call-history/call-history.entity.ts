import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { BaseAuditEntity } from "@common/entity/base-audit.entity";
import { Customer } from "../customer/customer.entity";
import { User } from "../user/user.entity";

@Entity({ name: "call_histories", schema: "public" })
export class CallHistory extends BaseAuditEntity {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id!: string;

  @Column({ type: "bigint", name: "customerId" })
  customerId!: string;

  @ManyToOne(() => Customer, { eager: false, onDelete: "CASCADE" })
  @JoinColumn({ name: "customerId" })
  customer?: Customer;

  @Column({ type: "bigint", name: "calledById", nullable: true })
  calledById?: string;

  @ManyToOne(() => User, { eager: false, onDelete: "SET NULL", nullable: true })
  @JoinColumn({ name: "calledById" })
  calledBy?: User;

  @Column({ type: "text", nullable: true })
  note?: string;
}
