import { MigrationInterface, QueryRunner } from 'typeorm';

export class fixStravaRelation1591892184136 implements MigrationInterface {
  name = 'fixStravaRelation1591892184136';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "public"."user" DROP CONSTRAINT "FK_7ef291cd5bac67bf9615ddffeca"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."user" DROP CONSTRAINT "UQ_7ef291cd5bac67bf9615ddffeca"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."user" DROP COLUMN "stravaUserId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."strava_user" ADD "userId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."strava_user" ADD CONSTRAINT "UQ_2dae299d10f44eda0b943c39776" UNIQUE ("userId")`,
    );

    await queryRunner.query(
      `ALTER TABLE "public"."strava_user" ADD CONSTRAINT "FK_2dae299d10f44eda0b943c39776" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "public"."strava_user" DROP CONSTRAINT "FK_2dae299d10f44eda0b943c39776"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."strava_user" DROP CONSTRAINT "UQ_2dae299d10f44eda0b943c39776"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."strava_user" DROP COLUMN "userId"`,
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
  }
}
