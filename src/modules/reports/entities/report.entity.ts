import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { reason_enum, ReportStatus_enum } from '../dto/create-report.dto';

@Entity('reports')
export class Report {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  reporter_id: string;

  @Column()
  reportable_type: string;

  @Column()
  reportable_id: string;

  @Column()
  reason: reason_enum;

  @Column('text')
  description: string;

  @Column()
  status: ReportStatus_enum;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // report.entity.ts
  @ManyToOne(() => User, (user) => user.reports, { eager: false })
  @JoinColumn({ name: 'reporter_id' }) // links column reporter_id
  user: User;
}
