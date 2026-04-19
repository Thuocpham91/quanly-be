import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { BaseAuditEntity } from "@common/entity/base-audit.entity";
import { ObjectTask } from "./object-task.entity";

export enum ObjectType {
  VAO_AP_TRUNG = "vào ấp trứng",
  VAO_GA = "vào gà",
}

@Entity({ name: "OBJECT", schema: "public" })
export class ObjectEntity extends BaseAuditEntity {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id!: string;

  @Column({ type: "varchar", length: 255 })
  name!: string;

  @Column({ type: "timestamp", nullable: true })
  startDate?: Date;

  @Column({ type: "varchar", length: 500, nullable: true })
  description?: string;

  @Column({
    type: "enum",
    enum: ObjectType,
    nullable: true,
  })
  type?: ObjectType;

  @Column({ type: "int", nullable: true })
  quantity?: number;

  @OneToMany(() => ObjectTask, (task) => task.object, { cascade: true })
  tasks?: ObjectTask[];
}
