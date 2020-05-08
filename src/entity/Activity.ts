import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert } from 'typeorm'
import nanoid from 'nanoid'

@Entity()
export class Activity {
  @PrimaryGeneratedColumn({ type: 'uuid' })
  id!: number

  @Column('int')
  week!: number

  @Column()
  name!: string

  @Column()
  activity!: string

  @Column({ name: 'short_id' })
  shortId!: string

  @Column({ name: 'updated_at' })
  updatedAt!: Date

  @Column({ name: 'created_at' })
  createdAt!: Date

  @BeforeInsert()
  updateDates() {
    this.shortId = nanoid(8)
  }
}
