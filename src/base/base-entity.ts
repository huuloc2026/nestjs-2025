import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export class BaseEntity {
  @PrimaryGeneratedColumn()
  id?: string;

  @CreateDateColumn({ type: 'timestamp' , nullable: true })
  createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamp',  nullable: true })
  updatedAt?: Date;
}
