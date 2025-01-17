import { BaseEntity } from 'src/base-entity';
import { Product } from 'src/product/entities/product.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';


@Entity('seller')
export class Seller extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column()
  storeName: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Product, (product) => product.seller)
  products: Product[];
}
