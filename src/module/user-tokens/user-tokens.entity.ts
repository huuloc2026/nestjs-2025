import { BaseEntity } from 'src/base/base-entity';
import { User } from 'src/module/user/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToOne,
} from 'typeorm';

@Entity('user_tokens')
export class Token extends BaseEntity {
  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'text' })
  accessToken: string;

  @Column({ type: 'text' })
  refreshToken: string;

  @Column({default:null})
  salt:string

  @Column({ type: 'boolean', default: false })
  isRevoked: boolean;
}
