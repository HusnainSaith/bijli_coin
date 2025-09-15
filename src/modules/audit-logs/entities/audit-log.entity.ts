import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ nullable: true })
  user_id: string;

  @Column()
  action: string;

  @Column({ nullable: true })
  auditable_type: string;

  @Column({ nullable: true })
  auditable_id: string;

  @Column({ nullable: true })
  ip_address: string;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}