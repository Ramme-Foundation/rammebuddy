import 'reflect-metadata'
import { createConnection, ConnectionOptions } from 'typeorm'
import path from 'path'
import { isDevMode } from '../utils/isDevelopmentMode'
import { logger } from '../utils/logger'

export default (
  databaseUrl = 'postgres://postgres:postgres@localhost:5432/rammebuddy',
  forceDisableSSL = false,
) => {
  logger.info(`(DATABASE) Connecting to database`)
  const connection = createConnection(<ConnectionOptions>{
    type: 'postgres',
    // We need add the extra SSL to use heroku on localhost
    extra: {
      ssl:
        forceDisableSSL || isDevMode() ? false : { rejectUnauthorized: false },
    },
    url: databaseUrl,
    entities:
      process.env.NODE_ENV === 'development'
        ? [path.resolve(__dirname, '../entity/*.ts')]
        : [path.resolve(__dirname, '../../dist/src/entity/*.ts')],
    subscribers: [],
    logging: process.env.NODE_ENV === 'development',
  })
  logger.info(`(DATABASE) connection established`)
  return connection
}
