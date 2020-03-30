export interface Activity {
  week: number
  message: string
}

export const parseActivity = (message: string): Activity => {
  const WEEK_REGEX = /(?:vecka|week)?\s*(\d+)/g
  const match = WEEK_REGEX.exec(message)
  let week = 0
  if (match === null || match.length === 0) {
    console.log(message, match?.length, match)
    throw Error('failed to parse activity')
  }
  week = Number(match![1].trim())
  const parsedMessage = message.replace(match![0], '').trim()
  return {
    week,
    message: parsedMessage,
  }
}
