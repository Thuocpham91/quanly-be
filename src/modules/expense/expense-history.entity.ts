import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { BaseAuditEntity } from "@common/entity/base-audit.entity";
import { Expense } from "./expense.entity";

@Entity({ name: "EXPENSE_HISTORY", schema: "public" })
export class ExpenseHistory extends BaseAuditEntity {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id!: string;

  @Column({ type: "bigint" })
  expenseId!: string;

  @ManyToOne(() => Expense, (expense) => expense.histories, { onDelete: "CASCADE" })
  @JoinColumn({ name: "expenseId" })
  expense!: Expense;

  @Column({ type: "decimal", precision: 15, scale: 2, transformer: {
    to: (value: number) => value,
    from: (value: string) => parseFloat(value)
  }})
  oldPaidAmount!: number;

  @Column({ type: "decimal", precision: 15, scale: 2, transformer: {
    to: (value: number) => value,
    from: (value: string) => parseFloat(value)
  }})
  newPaidAmount!: number;

  @Column({ type: "decimal", precision: 15, scale: 2, transformer: {
    to: (value: number) => value,
    from: (value: string) => parseFloat(value)
  }})
  changeAmount!: number;

  @Column({ type: "varchar", length: 500, nullable: true })
  note?: string;
}
