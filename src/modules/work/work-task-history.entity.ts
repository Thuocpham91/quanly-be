import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { BaseAuditEntity } from "@common/entity/base-audit.entity";
import { WorkTask } from "./work-task.entity";

@Entity({ name: "WORK_TASK_HISTORY", schema: "public" })
export class WorkTaskHistory extends BaseAuditEntity {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id!: string;

  @Column({ type: "bigint" })
  workTaskId!: string;

  @ManyToOne(() => WorkTask, { onDelete: "CASCADE" })
  @JoinColumn({ name: "workTaskId" })
  workTask!: WorkTask;

  @Column({ type: "varchar", length: 255 })
  action!: string;

  @Column({ type: "varchar", length: 500, nullable: true })
  oldValue?: string;

  @Column({ type: "varchar", length: 500, nullable: true })
  newValue?: string;

  @Column({ type: "varchar", length: 500, nullable: true })
  description?: string;
}
