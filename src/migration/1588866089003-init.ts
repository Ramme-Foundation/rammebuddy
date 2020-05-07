import { MigrationInterface, QueryRunner } from 'typeorm'

export class init1588866089003 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    queryRunner.query(`
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

  public async down(queryRunner: QueryRunner): Promise<any> {
    queryRunner.query('DROP TABLE events')
  }
}
