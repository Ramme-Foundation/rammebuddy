import {
  Entity,
  PrimaryGeneratedColumn,
  BeforeInsert,
  BeforeUpdate,
  BaseEntity,
  Column,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { SlackUser } from './SlackUser';
import { StravaUser } from './StravaUser';
import { Strava } from 'strava-v3';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  stravaId!: string;

  @Column({ name: 'updated_at' })
  updatedAt!: Date;

  @Column({ name: 'created_at' })
  createdAt!: Date;

  @OneToMany((type) => SlackUser, (slackUser) => slackUser.user)
  slackUsers!: SlackUser[];

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
