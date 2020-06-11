import {
  Entity,
  PrimaryGeneratedColumn,
  BeforeInsert,
  BeforeUpdate,
  BaseEntity,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './User';

@Entity()
export class StravaUser extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  stravaId!: string;

  @Column()
  refreshToken!: string;

  @Column()
  accessToken!: string;

  @Column({ name: 'expires_at' })
  expiresAt!: Date;

  @Column({ name: 'updated_at' })
  updatedAt!: Date;

  @Column({ name: 'created_at' })
  createdAt!: Date;

  @OneToOne((type) => User)
  @JoinColumn()
  user?: User;

  @BeforeInsert()
  createTimestamps() {
    const date = new Date();
    this.updatedAt = date;
    this.createdAt = date;
  }

  @BeforeUpdate()
  updateTimestamp() {
    this.updatedAt = new Date();
  }
}
