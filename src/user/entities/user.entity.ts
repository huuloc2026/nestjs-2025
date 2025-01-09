import { Post } from "src/post/entities/post.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ type: 'varchar',nullable:true })
  name!: string;

  @Column({ type: 'varchar', nullable: true })
  fullName!: string;

  @Column({ type: 'date', nullable: true })
  dateOfBirth!: Date | string;

  @Column({ type: 'enum', enum: ['Male', 'Female', 'Other'], default: 'Other' })
  gender!: 'Male' | 'Female' | 'Other';

  @Column({ type: 'varchar', nullable: true })
  phoneNumber!: string;

  @Column({ type: 'text', nullable: true })
  address!: string;

  @Column({
    type: 'enum',
    enum: ['User', 'Admin', 'Moderator'],
    default: 'User',
  })
  role!: 'User' | 'Admin' | 'Moderator';

  @Column({ type: 'boolean', default: false })
  isVerified!: boolean;

  @Column({ type: 'varchar', nullable: true })
  verificationCode!: string;

  @Column({ type: 'varchar', nullable: true })
  salt!: string;

  @Column({ nullable: true })
  Avatar!: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;

  @OneToMany(()=>Post,(post)=>post.author)
  post: Post[]
}
