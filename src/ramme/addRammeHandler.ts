import { Repository, Event } from '../core'
import { Ramme, RammeEvents } from '.'
import { logger } from '../utils/logger'
import { Request, Response } from 'express'
import { getCurrentWeekNumber, generateId } from '../utils'

const getActivity = (text: string) => {
  let activity
  try {
    activity = text[1]
  } catch (error) {}

  return activity
}

const getWeekInMessage = (text: string) => {
  let week = getCurrentWeekNumber()

  if (!text) return week

  if (text.length === 3) {
    try {
      week = parseInt(text[2])
    } catch (error) {}
  }

  return week
}

export const addRammeHandler = async (
  req: Request,
  res: Response,
  repository: Repository<Ramme>,
) => {
  const input = req.body.text.split(' ')
  const activity = getActivity(input)

  if (!activity) {
    res.status(400).send('Empty activity')
    return
  }

  const committer = req.body.user_name
  const week = getWeekInMessage(input)
  const id = generateId()

  const ramme: Event<Ramme> = {
    id,
    timestamp: Date.now(),
    version: 0,
    week,
    event: RammeEvents.RammeAdded,
    committer,
    data: {
      activity,
    },
  }

  try {
    const resId = await repository.save(ramme)
    const response = `aktivitet "${activity}" loggad i vecka ${week} med ID: ${resId} av ${committer}`
    res.send({
      response_type: 'in_channel',
      text: response,
    })
  } catch (e) {
    logger.error(`Could not save ramme: `, e)
    res.status(500).send(`Något gick fel vid sparandet av ramme :(`)
  }
}
