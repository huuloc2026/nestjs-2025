import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 250, nullable: false })
  title: string;

  @Column('text')
  content: string;

  @Column({ type: 'varchar', length: 2048, nullable: false })
  thumbnail: string;

  @Column({ type: 'varchar', length: 125 })
  category: string;

  @Column({ type: 'datetime', default: () => 'now()' })
  dateTime: Date;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn()
  @Column({ type: 'varchar', length: 125 })
  author: User | string;

  @Column('simple-array')
  tags: string[];

  @Column({ type: 'enum', enum: ['Draft', 'Published', 'Deleted'] })
  status: string;

  @Column({ type: 'varchar', length: 500 })
  description: string;

  @Column({ type: 'int', default: 0 })
  views: number;

  @Column({ type: 'int', default: 0 })
  commentsCount: number;
}
