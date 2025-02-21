import { BaseEntity } from "src/base/base-entity";
import { Order } from "src/module/order/entities/order.entity";

import { Post } from "src/module/post/entities/post.entity";
import { Token } from "src/module/user-tokens/user-tokens.entity";
import { GENDER, ROLE } from "src/module/user/enum/EUser";

import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity('users')
export class User extends BaseEntity {
  @Column({ nullable: false })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ type: 'varchar', nullable: true })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  fullName: string;

  @Column({ type: 'date', nullable: true })
  dateOfBirth: Date;

  @Column({ type: 'enum', enum: GENDER, default: GENDER.OTHER })
  gender: GENDER;

  @Column({ type: 'varchar', nullable: true })
  phoneNumber: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({
    type: 'enum',
    enum: ROLE,
    default: ROLE.USER,
  })
  role: ROLE;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @Column({ type: 'varchar', nullable: true })
  refreshToken: string;

  @Column({ type: 'boolean', default: false })
  isActive: boolean;

  @Column({ type: 'varchar', nullable: true })
  verificationCode: number;

  @Column({ type: 'varchar', nullable: true })
  salt: string;

  @Column({ nullable: true })
  Avatar: string;

  @OneToMany(() => Post, (post) => post.author)
  post: Post[];


}
