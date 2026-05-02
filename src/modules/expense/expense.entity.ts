import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { BaseAuditEntity } from "@common/entity/base-audit.entity";
import { Work } from "../work/work.entity";
import { ExpenseHistory } from "./expense-history.entity";

@Entity({ name: "EXPENSE", schema: "public" })
export class Expense extends BaseAuditEntity {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id!: string;

  @Column({ type: "varchar", length: 255 })
  title!: string;

  @Column({ type: "varchar", length: 20, default: "EXPENSE" })
  type!: "INCOME" | "EXPENSE" | "DEBT";

  @Column({ type: "decimal", precision: 15, scale: 2, transformer: {
    to: (value: number) => value,
    from: (value: string) => parseFloat(value)
  }})
  amount!: number;

  @Column({ type: "decimal", precision: 15, scale: 2, default: 0, transformer: {
    to: (value: number) => value,
    from: (value: string) => parseFloat(value)
  }})
  paidAmount!: number;

  @Column({ type: "timestamptz" })
  date!: Date;

  @Column({ type: "varchar", length: 100 })
  category!: string; // e.g. "Cám", "Thuốc", "Điện nước", "Lương", "Khác"

  @Column({ type: "bigint", nullable: true })
  workId?: string;

  @ManyToOne(() => Work, { onDelete: "SET NULL" })
  @JoinColumn({ name: "workId" })
  work?: Work;

  @Column({ type: "bigint", nullable: true })
  orderId?: string;

  @Column({ type: "varchar", length: 20, nullable: true })
  debtType?: "RECEIVABLE" | "PAYABLE";

  @Column({ type: "varchar", length: 20, nullable: true })
  debtStatus?: "PENDING" | "PAID";

  @Column({ type: "varchar", length: 255, nullable: true })
  debtorName?: string;

  @Column({ type: "timestamptz", nullable: true })
  dueDate?: Date;

  @Column({ type: "varchar", length: 500, nullable: true })
  description?: string;

  @OneToMany(() => ExpenseHistory, (history) => history.expense)
  histories?: ExpenseHistory[];
}
