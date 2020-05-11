import dotenv from 'dotenv'
import { logger } from './src/utils/logger'

dotenv.config()

logger.level = 'silent'

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason)
})

process.env.DATABASE_TEST_URL =
  process.env.DATABASE_TEST_URL || 'postgres://test:test@localhost:5432/test'

process.env.DATABASE_URL = process.env.DATABASE_TEST_URL
