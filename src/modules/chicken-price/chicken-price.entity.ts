import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "CHICKEN_PRICE", schema: "public" })
export class ChickenPrice {
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

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
