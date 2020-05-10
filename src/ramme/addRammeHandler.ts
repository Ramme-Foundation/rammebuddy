import { Request, Response } from 'express'
import { getConnection } from 'typeorm'
import { logger } from '../utils/logger'
import { Activity } from '../entity/Activity'
import { parseActivity, ParsedActivity } from '../utils/parseActivity'

export const addRammeHandler = async (req: Request, res: Response) => {
  let activity: ParsedActivity | null = null
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

  const ramme = new Activity()
  ramme.name = activity.message
  ramme.week = activity.week
  ramme.username = req.body.user_name

  try {
    const createdActivity = await getConnection()
      .getRepository(Activity)
      .save(ramme)

    const response = `activity "${activity.message}" logged in week ${createdActivity.week} with id: ${createdActivity.shortId} by ${createdActivity.username}`
    res.send({
      response_type: 'in_channel',
      text: response,
    })
    res.status(200)
    res.send()
  } catch (e) {
    logger.error(`Could not save ramme: [${ramme}] due to `, e)
    res.status(500)
    res.send()
  }
}
