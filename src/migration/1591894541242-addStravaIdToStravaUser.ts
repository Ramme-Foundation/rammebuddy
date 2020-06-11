import { MigrationInterface, QueryRunner } from 'typeorm';

export class addStravaIdToStravaUser1591894541242
  implements MigrationInterface {
  name = 'addStravaIdToStravaUser1591894541242';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "public"."strava_user" ADD "stravaId" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."user" DROP COLUMN "stravaId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."user" ADD "stravaId" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "public"."user" DROP COLUMN "stravaId"`,
    );
    await queryRunner.query(`ALTER TABLE "public"."user" ADD "stravaId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "public"."strava_user" DROP COLUMN "stravaId"`,
    );
  }
}
