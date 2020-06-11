import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserObject1590344472968 implements MigrationInterface {
  name = 'CreateUserObject1590344472968';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "public"."user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "stravaId" character varying NOT NULL, "updated_at" TIMESTAMP NOT NULL, "created_at" TIMESTAMP NOT NULL, CONSTRAINT "PK_03b91d2b8321aa7ba32257dc321" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "public"."slack_user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "slackId" character varying NOT NULL, "username" character varying NOT NULL, "teamId" character varying NOT NULL, "updated_at" TIMESTAMP NOT NULL, "created_at" TIMESTAMP NOT NULL, "userId" uuid, CONSTRAINT "PK_66356f25c4a1c383fa2fd4fdcf1" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "public"."slack_user" DROP CONSTRAINT "FK_27108f93d20e356382729f665f8"`,
    );
    await queryRunner.query(`DROP TABLE "public"."slack_user"`);
    await queryRunner.query(`DROP TABLE "public"."user"`);
  }
}
