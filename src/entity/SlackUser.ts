import {
  Entity,
  PrimaryGeneratedColumn,
  BeforeInsert,
  BeforeUpdate,
  BaseEntity,
  Column,
  ManyToOne,
} from 'typeorm';
import { User } from './User';

@Entity()
export class SlackUser extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  slackId!: string;

  @Column()
  username!: string;

  @Column()
  teamId!: string;

  @ManyToOne((type) => User, (user) => user.slackUsers)
  user!: User;

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
