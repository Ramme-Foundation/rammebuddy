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
  const week = getWeekInMessage(req.body.text) || getCurrentWeekNumber()
  const events = await repository.getByWeek(week)

  const formattedWeek = formatWeek(reduceWeek(events))

  res.send({
    response_type: 'in_channel',
    text: formattedWeek,
  })
}

const formatWeek = (week: ReducedWeek) => {
  const warriors = Object.keys(week).map(committer => {
    const activities = week[committer]
    return `${committer} (${activities.length}) : [${activities}]`
  })
  return warriors.join('\n')
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

const getWeekInMessage = (text: string | undefined) => {
  if (!text) return undefined

  let week
  try {
    const parts = text.split(' ')
    if (parts.length === 3) {
      week = parts[2]
      return parseInt(week)
    }
  } catch (error) {
    return undefined
  }
}
