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
    const response = `Användning av Rammebuddy:
    -'/ramme add <aktivitet> [<vecka>]' för att registrera ett träningspass för: <aktivitet>. (nuvarande vecka som standard).

    -'/ramme week [<vecka>]' för att visa antal pass för vecka <vecka> (nuvarande vecka som standard)

    -'/ramme edit <id> <aktivitet>' för att uppdatera aktivitet med id: <id> till aktivitet: <aktivitet>

    -'/ramme archive <id>' för att arkivera pass med id: <id>

    -'/ramme total' för att se totalt antal pass`

    res.send({
      response_type: 'in_channel',
      text: response,
    })
  } catch (e) {
    res.status(401).send('Could not help ramme')
  }
}
