
import { BaseEntity } from 'src/base/base-entity';
import { Product } from 'src/module/product/entities/product.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';


@Entity('category')
export class Category extends BaseEntity  {
  @Column({ unique: true })
  name: string;

  @ManyToMany(() => Product, (product) => product.categories)
  products: Product[];
}
