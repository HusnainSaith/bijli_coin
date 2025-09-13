import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Category } from 'src/modules/categories/entities/category.entity';
import { Post } from 'src/modules/posts/entities/post.entity';

@Entity('followers')
export class Follower {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  follower_id: string;

  @Column()
  following_type: string;

  @Column()
  following_id: string;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'follower_id' })
  follower: User;


}