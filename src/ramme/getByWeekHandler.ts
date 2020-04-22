import { Repository, Event } from '../core'
import { Ramme } from '.'
import { getCurrentWeekNumber } from '../utils'
import { Request, Response } from 'express'
import { reduceRamme } from './reduceRamme'

type ReducedWeek = { [key: string]: string[] }

export const getByWeekHandler = async (
  req: Request,
  res: Response,
  repository: Repository<Ramme>,
) => {
  const week = getWeekInMessage(req.body.text)
  const events = await repository.getByWeek(week)

  const formattedWeek = formatWeek(reduceWeek(events))

  res.send({
    response_type: 'in_channel',
    blocks: formattedWeek,
  })
}

const formatWeek = (week: ReducedWeek) => {
  const warriors = Object.keys(week).map(committer => {
    const activities = week[committer]
    return {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*${committer}:* [${activities.length}] ${activities.join(', ')}`,
      },
    }
  })
  return warriors
}

const reduceWeek = (events: Event<Ramme>[]) => {
  const ids = events.map((e: Event<Ramme>) => e.id)
  const unique = [...new Set(ids)]

  const rammesBy: ReducedWeek = {}

  unique.forEach(id => {
    const ramme = events.filter((e: Event<Ramme>) => e.id === id)

    const reducedRamme = reduceRamme(ramme)

    if (reducedRamme?.activity) {
      const committer = ramme[0].committer
      const activity = reducedRamme.activity

      if (Object.prototype.hasOwnProperty.call(rammesBy, committer)) {
        rammesBy[committer].push(activity)
      } else {
        rammesBy[committer] = [activity]
      }
    }
  })

  return rammesBy
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
