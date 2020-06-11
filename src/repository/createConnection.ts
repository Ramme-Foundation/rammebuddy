import 'reflect-metadata';
import { createConnection, ConnectionOptions } from 'typeorm';
import path from 'path';
import { isDevMode } from '../utils/isDevelopmentMode';
import { logger } from '../utils/logger';

export default (
  databaseUrl = 'postgres://postgres:postgres@localhost:5432/rammebuddy',
  forceDisableSSL = false,
) => {
  logger.info(`(DATABASE) Connecting to database`);
  const entitiesPath =
    process.env.NODE_ENV === 'production'
      ? [path.resolve(__dirname, '../entity/*.js')]
      : [path.resolve(__dirname, '../entity/*.ts')];
  logger.info(`loading entities from ${entitiesPath.join(',')}`);
  const connection = createConnection(<ConnectionOptions>{
    type: 'postgres',
    // We need add the extra SSL to use heroku on localhost
    extra: {
      ssl:
        forceDisableSSL || isDevMode() ? false : { rejectUnauthorized: false },
    },
    url: databaseUrl,
    entities: entitiesPath,
    subscribers: [],
    logging: process.env.NODE_ENV === 'development',
  });
  logger.info(`(DATABASE) connection established`);
  return connection;
};
