import { Repository } from '../core'
import { Ramme } from '.'
import { getCurrentWeekNumber } from '../utils'
import { Request, Response } from 'express'

const getWeekInMessage = (text: string | undefined) => {
  if (!text) return undefined

  let week
  try {
    const parts = text.split(' ')
    if (parts.length === 3) {
      week = parts[2]
      return parseInt(week)
    }
  } catch (error) {
    return undefined
  }
}

export const getByWeekHandler = async (
  req: Request,
  res: Response,
  repository: Repository<Ramme>,
) => {
  const week = getWeekInMessage(req.body.text) || getCurrentWeekNumber()
  const eventRows = await repository.getByWeek<Ramme>(week)

  res.send(eventRows)
}
