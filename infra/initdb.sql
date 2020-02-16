\set userName `echo "$POSTGRES_USER"`
\set dbName `echo "$POSTGRES_DB"`

GRANT ALL PRIVILEGES ON DATABASE :dbName TO :userName;

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