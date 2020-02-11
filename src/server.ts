import { Pool } from 'pg'
import { logger } from './utils/logger'
import { createRepository } from './core/repository'
import {
  Ramme,
  addRammeHandler,
  commandParser,
  archiveRammeHandler,
} from './ramme'
import { getByWeekHandler } from './ramme/getByWeekHandler'
import express from 'express'
import bodyParser from 'body-parser'
import { editRammeHandler } from './ramme/editRammeHandler'

require('dotenv').config()

const connectToDb = async () => {
  logger.info(`(DB) Connecting...`)
  const pool = new Pool()
  logger.info(`(DB) Connection established.`)
  return pool
}

const start = async () => {
  logger.info(`Starting in mode: ${process.env.NODE_ENV}`)
  const db = await connectToDb()
  const rammeRepo = createRepository<Ramme>(db)
  const app = express()

  app.use(bodyParser.json())

  app.get('/', async (req, res) => res.send(`Ramme Buddy 0.0.1: OK`))

  app.post('/ramme', async (req, res) => {
    const message = req.body.text

    const command = commandParser(message)

    switch (command) {
      case 'add': {
        addRammeHandler(req, res, rammeRepo)
        break
      }
      case 'vecka': {
        getByWeekHandler(req, res, rammeRepo)
        break
      }
      case 'edit': {
        editRammeHandler(req, res, rammeRepo)
        break
      }
      case 'arkivera': {
        archiveRammeHandler(req, res, rammeRepo)
        break
      }
      default: {
        res.status(400).send('Unknown command')
        break
      }
    }
  })

  app.listen(process.env.APP_PORT)

  logger.info(`(APP) Listening at port ${process.env.APP_PORT}`)
}

start()
