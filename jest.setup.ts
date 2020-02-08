import { logger } from './src/utils/logger'

logger.level = 'silent'

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason)
})
