import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm'
import nanoid from 'nanoid'

@Entity()
export class Activity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column('int')
  week!: number

  @Column()
  username!: string

  @Column()
  name!: string

  @Column({ name: 'short_id' })
  shortId!: string

  @Column({ name: 'updated_at' })
  updatedAt!: Date

  @Column({ name: 'created_at' })
  createdAt!: Date

  @BeforeInsert()
  updateShortId() {
    this.shortId = nanoid(8)
  }

  @BeforeInsert()
  createTimestamps() {
    const date = new Date()
    this.updatedAt = date
    this.createdAt = date
  }

  @BeforeUpdate()
  updateTimestamp() {
    this.updatedAt = new Date()
  }
}
