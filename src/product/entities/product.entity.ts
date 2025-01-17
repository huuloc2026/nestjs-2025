import { BaseEntity } from 'src/base-entity';
import { Category } from 'src/module/category/entities/category.entity';
import { Seller } from 'src/module/seller/entities/seller.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';

@Entity('product')
export class Product extends BaseEntity {

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column()
  stock: number;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => Seller, (seller) => seller.products)
  seller: Seller;

  @ManyToMany(() => Category, (category) => category.products)
  @JoinTable()
  categories: Category[];
}
