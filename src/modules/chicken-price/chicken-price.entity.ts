import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { BaseAuditEntity } from "@common/entity/base-audit.entity";

@Entity({ name: "CHICKEN_PRICE", schema: "public" })
export class ChickenPrice extends BaseAuditEntity {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id!: string;

  @Column({ type: "date" })
  priceDate!: Date;

  @Column({ type: "numeric", precision: 20, scale: 0 })
  pricePerKg!: number; // Giá kg hôm nay

  @Column({ type: "numeric", precision: 20, scale: 0, nullable: true })
  pricePerHead?: number;

  @Column({ type: "numeric", precision: 20, scale: 0, nullable: true })
  priceGaSo?: number;

  @Column({ type: "numeric", precision: 20, scale: 0, nullable: true })
  priceGaTrong?: number;

  @Column({ type: "numeric", precision: 20, scale: 0, nullable: true })
  priceGaMai?: number;

  @Column({ type: "text", nullable: true })
  note?: string;

}
