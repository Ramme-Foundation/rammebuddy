import { AggregateId } from '.'
import { logger } from '../utils/logger'
import { Pool } from 'pg'

export type Repository<T> = {
  save: (incoming: Event<T>) => Promise<AggregateId>
  get: (id: string) => Promise<Event<T>[]>
  getByWeek: (week: number) => Promise<Event<T>[]>
  getByCommitter: (committer: string, week?: number) => Promise<Event<T>[]>
}

export type Event<T> = {
  id: AggregateId
  timestamp: number
  version: number
  week: number
  event: string
  committer: string
  data?: T
}

const pool = new Pool({
  max: 10,
  connectionString: process.env.DATABASE_URL,
})

export const createRepository = <T>(pool: Pool) => {
  logger.info(`(DB) Initiating repository interface`)

  return {
    save: saveFn(pool),
    get: getFn(pool),
    getByWeek: getByWeekFn(pool),
    getByCommitter: getByCommitterFn(pool),
  } as Repository<T>
}

const saveFn = <T>(dbConn: Pool) => async (incoming: Event<T>) => {
  logger.info('Saving incoming event: ', incoming)
  const { id, timestamp, version, week, event, committer, data } = {
    ...incoming,
  }
  try {
    const saveResultId = await pool.query(
      `INSERT INTO events 
      (id, timestamp, version, week, event, committer, data)
      values($1, $2, $3, $4, $5, $6, $7)
      RETURNING id`,
      [id, timestamp, version, week, event, committer, data],
    )
    return saveResultId.rows[0].id as AggregateId
  } catch (e) {
    return Promise.reject(e)
  }
}

const getFn = <T>(dbConn: Pool) => async (id: AggregateId) => {
  const res = await pool.query(
    `SELECT * FROM events WHERE id = $1 order by sequence_number asc`,
    [id],
  )
  return res.rows as Event<T>[]
}

const getByWeekFn = <T>(dbConn: Pool) => async (week: number) => {
  const res = await pool.query(
    `SELECT * FROM events WHERE week = $1 order by sequence_number asc`,
    [week],
  )
  return res.rows as Event<T>[]
}

const getByCommitterFn = <T>(dbConn: Pool) => async (
  committer: string,
  week?: number,
) => {
  let res
  if (week) {
    res = await pool.query(
      `SELECT * FROM events WHERE 
      committer = $1 AND week = $2 order by sequence_number asc`,
      [committer, week],
    )
  } else {
    res = await pool.query(
      `SELECT * FROM events WHERE 
      committer = $1 order by sequence_number asc`,
      [committer],
    )
  }

  return res.rows as Event<T>[]
}
