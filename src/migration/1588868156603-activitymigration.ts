import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm'

export class activitymigration1588868156603 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: 'activity',
        columns: [
          {
            name: 'id',
            isPrimary: true,
            isNullable: false,
            type: 'uuid',
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'short_id',
            isNullable: false,
            type: 'varchar',
          },
          {
            name: 'username',
            isNullable: false,
            type: 'varchar',
          },
          {
            name: 'week',
            isNullable: false,
            type: 'int',
          },
          {
            name: 'name',
            isNullable: false,
            type: 'varchar',
          },
          {
            isNullable: false,
            name: 'updated_at',
            type: 'timestamptz',
          },
          {
            isNullable: false,
            name: 'created_at',
            type: 'timestamptz',
          },
        ],
      }),
    )

    await queryRunner.createIndex(
      'activity',
      new TableIndex({
        name: 'IDX_activity_shortid',
        columnNames: ['short_id'],
      }),
    )

    await this.createActivities(queryRunner)
    await queryRunner.dropTable('events')
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable('activity')
    await queryRunner.query(`
    CREATE TABLE IF NOT EXISTS "events" (
        "id" VARCHAR NOT NULL,
        "week" INT NOT NULL,
        "sequence_number" BIGSERIAL,
        "timestamp" BIGINT NOT NULL,
        "version" INT NOT NULL,
        "event" VARCHAR NOT NULL,
        "committer" VARCHAR NOT NULL,
        "data" JSONB,
        CONSTRAINT "events_pk" PRIMARY KEY ("id","week","version","event")
      );
    `)
  }

  private uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (Math.random() * 16) | 0
      var v = c === 'x' ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })
  }

  private async createActivities(queryRunner: QueryRunner) {
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

      const firstEvent = events[0]
      const lastEvent = events[events.length - 1]

      if (!lastEvent.data) {
        continue
      }
      console.log(firstEvent)
      console.log(lastEvent.timestamp)
      insertValues.push(`(`)
      await queryRunner.query(
        `
          INSERT INTO activity ( id, short_id, username, week, name, updated_at, created_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
      `,
        [
          this.uuidv4(),
          lastEvent.id, // For old data short_id and id is same
          lastEvent.committer,
          lastEvent.week,
          lastEvent.data.activity,
          new Date(Number(lastEvent.timestamp)).toISOString(),
          new Date(Number(firstEvent.timestamp)).toISOString(),
        ],
      )
    }

    console.info('Migrated', insertValues.length, 'events to activities')
  }
}
