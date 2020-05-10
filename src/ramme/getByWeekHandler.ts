import { getCurrentWeekNumber } from '../utils'
import { Request, Response } from 'express'
import { getConnection } from 'typeorm'
import { Activity } from '../entity/Activity'
import groupByUsername, { Dictionary } from '../utils/groupByUsername'

export const getByWeekHandler = async (req: Request, res: Response) => {
  const week = getWeekInMessage(req.body.text)
  const events = await getConnection()
    .getRepository(Activity)
    .find({ where: `week = ${week}` })

  const formattedWeek = formatWeek(groupByUsername(events))

  res.send({
    response_type: 'in_channel',
    blocks: formattedWeek,
  })
}

const formatWeek = (week: Dictionary<Activity[]>) => {
  const warriors = Object.keys(week).map((committer) => {
    const activities = week[committer]
    return {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*${committer}:* [${activities.length}] ${activities
          .map((a) => a.name)
          .join(', ')}`,
      },
    }
  })
  return warriors
}

const getWeekInMessage = (text: string) => {
  let week = getCurrentWeekNumber()

  if (!text) return week

  const parts = text.split(' ')
  if (parts.length === 2) {
    try {
      week = parseInt(parts[1])
    } catch (error) {}
  }

  return week
}
