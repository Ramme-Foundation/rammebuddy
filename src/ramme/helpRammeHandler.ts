import { Repository, Event } from '../core'
import { Ramme, RammeEvents } from '.'
import { logger } from '../utils/logger'
import { Request, Response } from 'express'
import { parseIdFromCommand } from './parseIdFromCommand'

export const helpRammeHandler = async (
  req: Request,
  res: Response,
  repository: Repository<Ramme>,
) => {
  try {
    const response = `Anvädning av Rammebuddy:
    -'/ramme add <namn>' för att registrera träningspass med namn: <namn>

    -'/ramme vecka [<vecka>]' för att visa antal pass för vecka <vecka> (default nuvarande vecka)

    -'/ramme edit <id> <namn>' för att uppdatera aktivtet med id: <id>. Sätter namn till <namn>

    -'/ramme arkivera <id>' för att akrivera pass med id: <id>
    `
    res.send({
      response_type: 'in_channel',
      text: response,
    })
  } catch (e) {
    res.status(401).send('Could not help ramme')
  }
}
