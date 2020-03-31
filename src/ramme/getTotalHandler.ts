import { Repository, Summary } from '../core'
import { Ramme } from '.'
import { Response } from 'express'

export const getTotalHandler = async (
  res: Response,
  repository: Repository<Ramme>,
) => {
  const total = await repository.getTotal()
  const formattedTotal = formatTotal(total)

  res.send({
    response_type: 'in_channel',
    text: formattedTotal,
  })
}

const formatTotal = (total: Summary<Ramme>[]) => {
  const totalStrings = total.map(row => {
    return `${row.committer}: ${row.count}`
  })
  return totalStrings.join('\n')
}
