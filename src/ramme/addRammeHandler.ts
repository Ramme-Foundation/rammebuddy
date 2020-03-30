import { Repository, Event } from '../core'
import { Ramme, RammeEvents } from '.'
import { logger } from '../utils/logger'
import { Request, Response } from 'express'
import { getCurrentWeekNumber, generateId } from '../utils'
import { parseActivity, Activity } from '../utils/parseActivity'

const getActivity = (messageParts: string[]) => {
  let activity
  try {
    activity = messageParts[1]
  } catch (error) {}

  return activity
}

export const addRammeHandler = async (
  req: Request,
  res: Response,
  repository: Repository<Ramme>,
) => {
  let activity: Activity | null = null
  try {
    activity = parseActivity(req.body.text)
  } catch {
    res.status(400).send('Empty activity')
    return
  }
  const committer = req.body.user_name
  const week = activity.week
  const id = generateId()

  const ramme: Event<Ramme> = {
    id,
    timestamp: Date.now(),
    version: 0,
    week,
    event: RammeEvents.RammeAdded,
    committer,
    data: {
      activity: activity.message,
    },
  }

  try {
    const resId = await repository.save(ramme)
    const response = `aktivitet "${activity}" loggad i vecka ${week} med ID: ${resId} av ${committer}`
    res
      .send({
        response_type: 'in_channel',
        text: response,
      })
      .status(200)
  } catch (e) {
    logger.error(`Could not save ramme: [${ramme}] due to `, e)
    res.status(500)
  }
}
