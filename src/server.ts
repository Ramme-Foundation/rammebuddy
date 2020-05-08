import { Pool } from 'pg'
import { logger } from './utils/logger'
import { createRepository } from './core/repository'
import {
  Ramme,
  addRammeHandler,
  commandParser,
  archiveRammeHandler,
  getTotalHandler,
} from './ramme'
import { getByWeekHandler } from './ramme/getByWeekHandler'
import express from 'express'
import bodyParser from 'body-parser'
import { editRammeHandler } from './ramme/editRammeHandler'
import { helpRammeHandler } from './ramme/helpRammeHandler'
import createConnection from './repository/createConnection'

require('dotenv').config()

const connectToDb = async (): Promise<Pool> => {
  logger.info(`(DB) Connecting...`)
  const pool = new Pool({
    max: 10,
    connectionString: process.env.DATABASE_URL,
  })
  try {
    await pool.connect()
    logger.info(`(DB) Connection established.`)
  } catch (e) {
    return process.exit(1)
  }
  return pool
}

const start = async () => {
  await createConnection()
  logger.info(`Starting in mode: ${process.env.NODE_ENV}`)

  const db = await connectToDb()
  const rammeRepo = createRepository<Ramme>(db)
  const app = express()

  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))

  app.get('/', async (_req, res) => res.send(`Ramme Buddy 0.0.1: OK`))

  app.post('/ramme', async (req, res) => {
    const message = req.body.text
    const command = commandParser(message)

    switch (command) {
      case 'add': {
        return addRammeHandler(req, res)
      }
      case 'week': {
        getByWeekHandler(req, res)
        break
      }
      case 'edit': {
        editRammeHandler(req, res, rammeRepo)
        break
      }
      case 'archive': {
        archiveRammeHandler(req, res)
        break
      }
      case 'total': {
        getTotalHandler(res)
        break
      }
      case 'help':
      default: {
        helpRammeHandler(req, res)
        break
      }
    }
  })

  const port = process.env.PORT || 3000
  app.listen(port)

  logger.info(`(APP) Listening at port ${port}`)
}

start()
