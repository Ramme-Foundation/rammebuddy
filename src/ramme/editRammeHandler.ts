import { Repository, Event } from '../core'
import { Ramme, RammeEvents } from '.'
import { logger } from '../utils/logger'
import { Request, Response } from 'express'
import { parseIdFromCommand } from './parseIdFromCommand'

export const editRammeHandler = async (
  req: Request,
  res: Response,
  repository: Repository<Ramme>,
) => {
  const id = parseIdFromCommand(req.body.text)
  const activity = getNewActivity(req.body.text)

  if (!id || !activity) {
    res.send('Could not parse edit command')
    return
  }

  const events = await repository.get(id)

  const lastEvent = events[events.length - 1]
  const highestVersion = lastEvent.version

  const e = { ...lastEvent }

  e.event = RammeEvents.RammeActivityEdited
  e.data = { activity }
  e.timestamp = Date.now()
  e.version = 1 + highestVersion

  try {
    const repoRes = await repository.save(e)
    res.send(`aktivitet med id ${repoRes} ändrad till ${activity}`)
  } catch (e) {
    res.status(401).send('Could not update ramme')
  }
}

const getNewActivity = (text: string) => {
  let activity
  try {
    activity = text
      .trim()
      .split(' ')
      .slice(3)
      .join(' ')
  } catch (e) {}

  return activity
}
