import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { BaseAuditEntity } from "@common/entity/base-audit.entity";
import { User } from "../../user/user.entity";

import { FbGroupType } from "@common/constans/enum.constant";

@Entity({ name: "FB_GROUP", schema: "public" })
export class FbGroupEntity extends BaseAuditEntity {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id!: string;

  @Column({ type: "varchar", length: 255 })
  name!: string;

  @Column({ type: "varchar", length: 500 })
  url!: string;

  @Column({
    type: "enum",
    enum: FbGroupType,
    default: FbGroupType.OTHER,
  })
  type!: FbGroupType;

  @Column({ type: "bigint" })
  userId!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "userId" })
  user?: User;
}
