import Logger from 'pino'
import { isDevMode } from './isDevelopmentMode'

export type Logger = Logger.Logger

export const logger = Logger({ useLevelLabels: isDevMode() })
