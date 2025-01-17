
import { BaseEntity } from 'src/base-entity';
import { Order } from 'src/module/order/entities/order.entity';
import { Product } from 'src/product/entities/product.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class OrderItem extends BaseEntity  {
  @Column()
  quantity: number;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @ManyToOne(() => Product)
  product: Product;

  @ManyToOne(() => Order, (order) => order.orderItems)
  order: Order;
}
