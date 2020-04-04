import { Repository, Event } from '../core'
import { Ramme, RammeEvents } from '.'
import { logger } from '../utils/logger'
import { Request, Response } from 'express'
import { generateId } from '../utils'
import { parseActivity, Activity } from '../utils/parseActivity'

export const addRammeHandler = async (
  req: Request,
  res: Response,
  repository: Repository<Ramme>,
) => {
  let activity: Activity | null = null
  try {
    const commandArray = (req.body.text as string).split(' ')
    const messageWithoutCommand = commandArray
      .slice(1, commandArray.length + 1)
      .join(' ')
    activity = parseActivity(messageWithoutCommand)
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
    const response = `aktivitet "${activity.message}" loggad i vecka ${week} med ID: ${resId} av ${committer}`
    res.send({
      response_type: 'in_channel',
      text: response,
    })
    res.status(200)
  } catch (e) {
    logger.error(`Could not save ramme: [${ramme}] due to `, e)
    res.status(500)
  }
}
