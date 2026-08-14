import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { BaseAuditEntity } from "@common/entity/base-audit.entity";
import { ObjectEntity } from "../object/object.entity";
import { WorkTask } from "./work-task.entity";
import { Order } from "../order/order.entity";

export enum WorkStatus {
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

@Entity({ name: "WORK", schema: "public" })
export class Work extends BaseAuditEntity {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id!: string;

  @Column({ type: "varchar", length: 255 })
  title!: string;

  @Column({
    type: "varchar",
    length: 20,
    default: WorkStatus.ACTIVE,
  })
  status!: WorkStatus;

  @Column({ type: "bigint" })
  objectId!: string;

  @ManyToOne(() => ObjectEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "objectId" })
  object!: ObjectEntity;

  @Column({ type: "varchar", length: 500, nullable: true })
  description?: string;

  @Column({ type: "timestamp", nullable: true })
  startDate?: Date;

  @Column({ type: "timestamp", nullable: true })
  workDate?: Date;

  @Column({ type: "timestamp", nullable: true })
  exportDate?: Date;

  @Column({ type: "int", nullable: true })
  quantity?: number;

  @Column({ type: "int", nullable: true })
  purchaseQuantity?: number;

  @Column({ type: "int", nullable: true, default: 0 })
  startDay?: number;

  @OneToMany(() => WorkTask, (task) => task.work, { cascade: true })
  workTasks!: WorkTask[];

  @OneToMany(() => Order, (order) => order.work)
  orders?: Order[];
}
