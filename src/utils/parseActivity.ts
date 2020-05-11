import { getCurrentWeekNumber } from './getCurrentWeekNumber'

export interface ParsedActivity {
  week: number
  message: string
}

export const parseActivity = (message: string): ParsedActivity => {
  const WEEK_REGEX = /(?:vecka|week)+?\s*(\d+)/g
  const match = WEEK_REGEX.exec(message)
  let week = getCurrentWeekNumber()
  if (match === null) {
    return {
      week,
      message,
    }
  }
  if (match?.length === 2) {
    week = Number(match![1].trim())
  }
  const parsedMessage = message.replace(match![0], '').trim()
  return {
    week,
    message: parsedMessage,
  }
}
