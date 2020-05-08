import 'reflect-metadata'
import { createConnection, ConnectionOptions } from 'typeorm'
import path from 'path'
import { isDevMode } from '../utils/isDevelopmentMode'
import { logger } from '../utils/logger'

export default () => {
  logger.info(`(DATABASE) Connecting to database`)
  const connection = createConnection(<ConnectionOptions>{
    type: 'postgres',
    // We need add the extra SSL to use heroku on localhost
    extra: {
      ssl: !isDevMode(),
    },
    url:
      process.env.DATABASE_URL ||
      'postgres://postgres:postgres@localhost:5432/rammebuddy',
    entities: [path.resolve(__dirname, '../entity/*.ts')],
    subscribers: [],
    logging: process.env.NODE_ENV === 'development',
  })
  logger.info(`(DATABASE) connection established`)
  return connection
}
