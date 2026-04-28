import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { BaseAuditEntity } from "@common/entity/base-audit.entity";
import { ObjectEntity } from "./object.entity";

@Entity({ name: "OBJECT_TASK", schema: "public" })
export class ObjectTask extends BaseAuditEntity {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id!: string;

  @Column({ type: "bigint" })
  objectId!: string;

  @ManyToOne(() => ObjectEntity, (object) => object.tasks, { onDelete: "CASCADE" })
  @JoinColumn({ name: "objectId" })
  object!: ObjectEntity;

  @Column({ type: "varchar", length: 255 })
  taskName!: string;

  @Column({ type: "int", nullable: true })
  quantity?: number;

  @Column({ type: "int", nullable: false })
  workDate!: number;

  @Column({ type: "int", nullable: true })
  removalCount?: number;

  @Column({ type: "varchar", length: 500, nullable: true })
  description?: string;

  @Column({ type: "float", nullable: true })
  feedPerAnimal?: number;
}
