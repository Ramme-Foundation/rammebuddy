import { Repository, Event } from '../core'
import { Ramme, RammeEvents } from '.'
import { logger } from '../utils/logger'
import { Request, Response } from 'express'
import { parseIdFromCommand } from './parseIdFromCommand'

export const archiveRammeHandler = async (
  req: Request,
  res: Response,
  repository: Repository<Ramme>,
) => {
  const id = parseIdFromCommand(req.body.text)
  if (!id) {
    res.send('Could not parse id')
    return
  }

  const events = await repository.get(id)

  const lastEvent = events[events.length - 1]
  const highestVersion = lastEvent.version

  const e = { ...lastEvent }

  e.event = RammeEvents.RammeArchived
  e.data = undefined
  e.timestamp = Date.now()
  e.version = 1 + highestVersion

  try {
    const repoRes = await repository.save(e)
    res.send(`aktivitet med id ${repoRes} arkiverad`)
  } catch (e) {
    res.status(401).send('Could not archive ramme')
  }
}
