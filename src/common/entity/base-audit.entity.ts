import { CreateDateColumn, UpdateDateColumn, DeleteDateColumn, Column, BaseEntity } from "typeorm";
import { Expose } from "class-transformer";

export abstract class BaseAuditEntity extends BaseEntity {
  @CreateDateColumn({ name: "createdAt", type: "timestamp with time zone" })
  @Expose()
  createdAt!: Date;

  @UpdateDateColumn({ name: "updatedAt", type: "timestamp with time zone" })
  @Expose()
  updatedAt!: Date;

  @DeleteDateColumn({ name: "deletedAt", type: "timestamp with time zone", nullable: true })
  @Expose()
  deletedAt?: Date;

  @Column({ name: "createdBy", type: "varchar", nullable: true })
  @Expose()
  createdBy?: string;

  @Column({ name: "updatedBy", type: "varchar", nullable: true })
  @Expose()
  updatedBy?: string;

  @Column({ name: "deletedBy", type: "varchar", nullable: true })
  @Expose()
  deletedBy?: string;
}
