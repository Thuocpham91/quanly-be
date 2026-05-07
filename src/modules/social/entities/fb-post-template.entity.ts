import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { BaseAuditEntity } from "@common/entity/base-audit.entity";
import { UserEntity } from "@modules/user/user.entity";

@Entity({ name: "FB_POST_TEMPLATE", schema: "public" })
export class FbPostTemplateEntity extends BaseAuditEntity {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id!: string;

  @Column({ type: "text" })
  content!: string;

  @Column({ type: "text", array: true, nullable: true })
  fileUrls?: string[];

  @Column({ type: "bigint" })
  userId!: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: "userId" })
  user?: UserEntity;
}
