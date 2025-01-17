import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export class BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @CreateDateColumn({ type: 'timestamp' , nullable: true })
  createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamp',  nullable: true })
  updatedAt?: Date;
}
