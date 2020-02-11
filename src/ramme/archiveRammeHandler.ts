import { Repository, Event } from '../core'
import { Ramme, RammeEvents } from '.'
import { logger } from '../utils/logger'
import { Request, Response } from 'express'

export const archiveRammeHandler = async (
  req: Request,
  res: Response,
  repository: Repository<Ramme>,
) => {
  /*
  TODO:

  Parse ID /ramme archive id
  events = repo.get(id)
  find highest version (easy because result is sorted)
  const newEvent = {
    id : id
    version: version +1
    event: RammeEvents.RammeArchived
  }
  repo.save(newEvent)
  
  */
  res.status(401).send('Not yet implemented')
}
