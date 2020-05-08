import { Repository, Summary } from '../core'
import { Ramme } from '.'
import { Response } from 'express'
import { getConnection } from 'typeorm'
import { Activity } from '../entity/Activity'

interface TotalCount {
  count: string
  username: string
}

export const getTotalHandler = async (res: Response) => {
  const total: TotalCount[] = await getConnection()
    .getRepository(Activity)
    .query(
      'SELECT COUNT(id), username from activity GROUP BY username ORDER BY username asc',
    )

  const formattedTotal = formatTotal(total)

  res.send({
    response_type: 'in_channel',
    text: formattedTotal,
  })
}

const formatTotal = (total: TotalCount[]) => {
  const totalStrings = total.map(row => {
    return `${row.username}: ${row.count}`
  })
  return totalStrings.join('\n')
}
