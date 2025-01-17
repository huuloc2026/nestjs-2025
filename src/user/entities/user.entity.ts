import { BaseEntity } from "src/base-entity";
import { Post } from "src/post/entities/post.entity";
import { GENDER, ROLE } from "src/user/entities/EUser";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";





@Entity('users')
export class User extends BaseEntity {
  @Column({ nullable: false })
  email: string;

  @Column({ nullable: false})
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

  @Column({ type: 'boolean', default: false })
  isVerified: boolean;

  @Column({ type: 'varchar', nullable: true })
  verificationCode: string;

  @Column({ type: 'varchar', nullable: true })
  salt: string;

  @Column({ nullable: true })
  Avatar: string;

  @OneToMany(() => Post, (post) => post.author)
  post: Post[];
}
