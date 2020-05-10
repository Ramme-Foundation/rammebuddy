var CI_DATABASE_URL = 'postgres://test:test@localhost:5432/test'

var base = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  schema: 'public',
  synchronize: false,
  logging: false,
  entities: ['src/entity/*.ts'],
  migrations: ['src/migration/*.ts'],
  subscribers: ['src/subscriber/*.ts'],
  cli: {
    entitiesDir: 'src/entity',
    migrationsDir: 'src/migration',
    subscribersDir: 'src/subscriber',
  },
  migrationsRun: true,
}

var config = {
  test: {
    url: process.env.DATABASE_TEST_URL || CI_DATABASE_URL,
    dropSchema: true,
  },
  development: {
    logging: true,
    url:
      process.env.DATABASE_URL ||
      'postgres://postgres:postgres@localhost:5432/rammebuddy',
  },
  production: {
    ssl: true,
    extra: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
    dropSchema: false,
  },
}

var mergedConfig = process.env.CI
  ? { ...base, ...config.test }
  : { ...base, ...config[process.env.NODE_ENV || 'development'] }

module.exports = mergedConfig
