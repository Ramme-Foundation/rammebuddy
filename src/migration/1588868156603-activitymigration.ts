import { MigrationInterface, QueryRunner, Table } from 'typeorm'
import { Ramme, RammeEvents } from '../ramme'
import { Event } from '../core'

export class activitymigration1588868156603 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: 'activity',
        columns: [
          {
            name: 'id',
            isPrimary: true,
            isGenerated: true,
            isNullable: false,
            type: 'int',
          },
          {
            name: 'username',
            type: 'varchar',
          },
          {
            name: 'week',
            type: 'int',
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'updated_at',
            type: 'timestamptz',
          },
          {
            name: 'created_at',
            type: 'timestamptz',
          },
        ],
      }),
    )

    await this.createActivites(queryRunner)
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable('activity')
  }

  private async createActivites(queryRunner: QueryRunner) {
    const eventIds = await queryRunner.query(
      'SELECT DISTINCT(id), sequence_number FROM events',
    )

    const insertValues = []

    for (const row of eventIds) {
      const events = await queryRunner.query(
        `SELECT * FROM events where id = '${row.id}' order by version asc`,
      )
      if (!events || events.length === 0) {
        continue
      }

      const firstEvent: Event<Ramme> = events[0]
      const lastEvent: Event<Ramme> = events[events.length - 1]

      if (!lastEvent.data) {
        continue
      }
      console.log(firstEvent)
      console.log(lastEvent.timestamp)
      insertValues.push(`(`)
      await queryRunner.query(
        `
          INSERT INTO activity ( username, week, name, updated_at, created_at)
          VALUES ($1, $2, $3, $4, $5)
      `,
        [
          lastEvent.committer,
          lastEvent.week,
          lastEvent.data.activity,
          new Date(Number(lastEvent.timestamp)).toISOString(),
          new Date(Number(firstEvent.timestamp)).toISOString(),
        ],
      )
    }

    console.info('Migrated', insertValues.length, 'events to activites')
  }
}
