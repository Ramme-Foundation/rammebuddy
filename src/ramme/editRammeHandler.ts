import { Request, Response } from 'express'
import { parseIdFromCommand } from './parseIdFromCommand'
import { getConnection } from 'typeorm'
import { Activity } from '../entity/Activity'
import { logger } from '../utils/logger'

export const editRammeHandler = async (req: Request, res: Response) => {
  const id = parseIdFromCommand(req.body.text)
  const parsedActivity = getNewActivity(req.body.text)

  if (!id || !parsedActivity) {
    res.send({
      response_type: 'in_channel',
      text: 'Could not parse edit command',
    })
    return
  }

  const activity = await getConnection()
    .getRepository(Activity)
    .findOne({ shortId: id })

  if (!activity) {
    res.send({
      response_type: 'in_channel',
      text: 'There is no activity with this ID',
    })
    return
  }

  if (activity.username !== req.body.user_name) {
    res.send({
      response_type: 'in_channel',
      text: "You're not allowed to edit the activities of other people",
    })
    return
  }

  activity.name = parsedActivity

  try {
    const repoRes = await getConnection().getRepository(Activity).save(activity)
    const response = `activity with id ${repoRes.shortId} changed to ${repoRes.name}`
    res.send({
      response_type: 'in_channel',
      text: response,
    })
  } catch (e) {
    logger.error(e)
    res.status(401).send({
      response_type: 'in_channel',
      text: 'error updating activity',
    })
  }
}

const getNewActivity = (text: string) => {
  let activity
  try {
    activity = text.trim().split(' ').slice(2).join(' ')
  } catch (e) {}

  return activity
}
