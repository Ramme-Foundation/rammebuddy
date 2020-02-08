import { Repository, Event } from '../core'
import { Ramme, RammeEvents } from '.'
import { logger } from '../utils/logger'
import { Request, Response } from 'express'
import { getCurrentWeekNumber, generateId } from '../utils'

const getActivity = (text: string) => {
  let activity
  try {
    activity = text.split(' ').slice(2)
  } catch (error) {
    throw new Error('Invalid add command')
  }

  return activity
}

export const addRammeHandler = async (
  req: Request,
  res: Response,
  repository: Repository<Ramme>,
) => {
  const activity = getActivity(req.body.text)?.join(' ')

  if (!activity) {
    res.status(400).send('Empty activity')
    return
  }

  const committer = 'Fluff'
  const week = getCurrentWeekNumber()
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
    const result = await repository.save(ramme)
    const response = `aktivitet "${activity}" loggad i vecka ${week} med ID: ${result.id} av ${committer}`
    res.send(response)
  } catch (e) {
    logger.error(`Could not save ramme: `, e)
    res.status(500).send(`Något gick fel vid sparandet av ramme :(`)
  }
}
