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

  if (events.length === 0) {
    res.send({
      response_type: 'in_channel',
      text: 'There is no activity with this ID',
    })
    return
  }

  const lastEvent = events[events.length - 1]
  const highestVersion = lastEvent.version
  const initEvent = events.find(event => event.event === 'RAMME_ADDED')
  const eventOwner = initEvent!.committer

  const event = {
    ...lastEvent,
    event: RammeEvents.RammeActivityEdited,
    data: { activity },
    timestamp: Date.now(),
    version: 1 + highestVersion,
    committer: req.body.user_name,
  }

  try {
    if (eventOwner === req.body.user_name) {
      const repoRes = await repository.save(event)
      const response = `aktivitet med id ${repoRes} ändrad till ${activity}`
      res.send({
        response_type: 'in_channel',
        text: response,
      })
    } else {
      res.send({
        response_type: 'in_channel',
        text: "You're not allowed to edit the activities of other people",
      })
      return
    }
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
      .slice(2)
      .join(' ')
  } catch (e) {}

  return activity
}
