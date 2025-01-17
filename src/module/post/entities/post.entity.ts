
import { BaseEntity } from "src/base-entity";
import { StatusPost } from "src/common/constants/StatusPost";
import { User } from "src/module/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('post')
export class Post extends BaseEntity {
  @Column({ type: 'varchar', length: 250, nullable: false })
  title: string;

  @Column('text')
  content: string;

  @Column({ type: 'varchar', length: 2048, nullable: false })
  thumbnail: string;

  @Column({ type: 'varchar', length: 125 })
  category: string;

  @ManyToOne(() => User, (user) => user.post, { nullable: false })
  @JoinColumn()
  author: User; 

  @Column('simple-array')
  tags: string[];

  @Column({ type: 'enum', enum: StatusPost, default: StatusPost.Draft })
  status: StatusPost;

  @Column({ type: 'varchar', length: 500 })
  description: string;

  @Column({ type: 'int', default: 0 })
  views: number;

  @Column({ type: 'int', default: 0 })
  commentsCount: number;
}
