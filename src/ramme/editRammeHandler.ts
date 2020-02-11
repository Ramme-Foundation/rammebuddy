import { Repository, Event } from '../core'
import { Ramme, RammeEvents } from '.'
import { logger } from '../utils/logger'
import { Request, Response } from 'express'

export const editRammeHandler = async (
  req: Request,
  res: Response,
  repository: Repository<Ramme>,
) => {
  /*
  TODO:

  Parse ID /ramme edit ID ny aktivitet
  events = repo.get(id)
  find highest version (easy because result is sorted)
  const newEvent = {
    id : id
    version: version +1
    data : { activity: new activity }
    event: RammeEvents.RAMME_ACTIVITY_EDITED
  }
  repo.save(newEvent)

  */
  res.status(401).send('Not yet implemented')
}
