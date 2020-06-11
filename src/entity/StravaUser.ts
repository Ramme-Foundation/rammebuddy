import {
  Entity,
  PrimaryGeneratedColumn,
  BeforeInsert,
  BeforeUpdate,
  BaseEntity,
  Column,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { User } from './User';

@Entity()
export class StravaUser extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

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
