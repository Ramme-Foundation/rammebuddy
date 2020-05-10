# Readme

Slackbot for Ramme logging.

## Installing

Run `yarn install` to install dependencies

Make sure to have a postgres instance running. Perhaps with docker. Set the following variables in `.env` file

```
DATABASE_URL=postgres://username:password@localhost:5432/rammebuddy
```

Then run migrations (these needs to be run every time you add a migration )

`yarn typeorm migration:run`

### Running tests

To be able to run e2e locally you need a database setup. Create one i postgres called "rammebuddy-test" and set these environment variables in `.env` file.

```
DATABASE_TEST_URL=postgres://username:password@localhost:5432/rammebuddy-test
DATABASE_DISABLE_SSL=true
```

### Add a dump into docker postgres

```
docker exec -i postgres-rammebuddy pg_restore --verbose --clean --no-acl --no-owner -h localhost -U postgres -d rammebuddy < filenamehere
```
