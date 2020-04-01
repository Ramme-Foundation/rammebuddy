import { Repository } from '../core'
import { Ramme, RammeEvents } from '.'
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
  const initEvent = events.find(event => event.event === 'RAMME_ADDED')
  const eventOwner = initEvent!.committer

  const event = {
    ...lastEvent,
    event: RammeEvents.RammeArchived,
    data: undefined,
    timestamp: Date.now(),
    version: 1 + highestVersion,
    committer: req.body.user_name,
  }

  try {
    if (eventOwner === req.body.user_name) {
      const repoRes = await repository.save(event)
      const response = `aktivitet med id ${repoRes} arkiverad`
      res.send({
        response_type: 'in_channel',
        text: response,
      })
    } else {
      res.send({
        response_type: 'in_channel',
        text: "You're not allowed to archive the activities of other people",
      })
      return
    }
  } catch (e) {
    res.status(401).send('Could not archive ramme')
  }
}
