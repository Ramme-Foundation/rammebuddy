import { MigrationInterface, QueryRunner } from 'typeorm';

export class StravaUser1591886051856 implements MigrationInterface {
  name = 'StravaUser1591886051856';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "public"."strava_user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "refreshToken" character varying NOT NULL, "accessToken" character varying NOT NULL, "expires_at" TIMESTAMP NOT NULL, "updated_at" TIMESTAMP NOT NULL, "created_at" TIMESTAMP NOT NULL, CONSTRAINT "PK_82ea9bc958ffb4603904b52531b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."user" ADD "stravaUserId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."user" ADD CONSTRAINT "UQ_7ef291cd5bac67bf9615ddffeca" UNIQUE ("stravaUserId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."user" ADD CONSTRAINT "FK_7ef291cd5bac67bf9615ddffeca" FOREIGN KEY ("stravaUserId") REFERENCES "public"."strava_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."slack_user" ADD CONSTRAINT "FK_27108f93d20e356382729f665f8" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "public"."slack_user" DROP CONSTRAINT "FK_27108f93d20e356382729f665f8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."user" DROP CONSTRAINT "FK_7ef291cd5bac67bf9615ddffeca"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."user" DROP CONSTRAINT "UQ_7ef291cd5bac67bf9615ddffeca"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."user" DROP COLUMN "stravaUserId"`,
    );
    await queryRunner.query(`DROP TABLE "public"."strava_user"`);
  }
}
