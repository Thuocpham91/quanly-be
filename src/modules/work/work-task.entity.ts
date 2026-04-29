import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { BaseAuditEntity } from "@common/entity/base-audit.entity";
import { Work } from "./work.entity";

@Entity({ name: "WORK_TASK", schema: "public" })
export class WorkTask extends BaseAuditEntity {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id!: string;

  @Column({ type: "bigint" })
  workId!: string;

  @ManyToOne(() => Work, (work) => work.workTasks, { onDelete: "CASCADE" })
  @JoinColumn({ name: "workId" })
  work!: Work;

  @Column({ type: "varchar", length: 255 })
  taskName!: string;

  @Column({ type: "varchar", length: 500, nullable: true })
  description?: string;

  @Column({ type: "timestamptz", nullable: true })
  startDate?: Date;

  @Column({ type: "boolean", default: false })
  employeeChecked!: boolean;

  @Column({ type: "boolean", default: false })
  managerChecked!: boolean;

  @Column({ type: "int", nullable: true })
  quantity?: number;

  @Column({ type: "int", nullable: true })
  removalCount?: number;

  @Column({ type: "simple-array", nullable: true })
  fileUrls?: string[];
}
