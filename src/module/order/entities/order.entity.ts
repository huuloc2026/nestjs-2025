import { BaseEntity } from 'src/base/base-entity';
import { StatusOrder } from 'src/module/order/enum/StatusOrder';
import { OrderItem } from 'src/module/order-item/entities/order-item.entity';
import { User } from 'src/module/user/entities/user.entity';


import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';


@Entity('orders')
export class Order extends BaseEntity {
  @Column('decimal', { precision: 10, scale: 2 })
  totalAmount: number;

  @Column({ type: 'enum', enum: StatusOrder })
  status: StatusOrder;

  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  orderItems: OrderItem[];
}
