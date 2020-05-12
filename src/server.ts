import express from 'express'
import bodyParser from 'body-parser'
// @ts-ignore
import * as AdminBroExpress from 'admin-bro-expressjs'
import { logger } from './utils/logger'
import { getByWeekHandler } from './ramme/getByWeekHandler'
import { editRammeHandler } from './ramme/editRammeHandler'
import { helpRammeHandler } from './ramme/helpRammeHandler'
import { archiveRammeHandler } from './ramme/archiveRammeHandler'
import { getTotalHandler } from './ramme/getTotalHandler'
import { addRammeHandler } from './ramme/addRammeHandler'
import { commandParser } from './ramme/commandParser'
import createConnection from './repository/createConnection'
import admin from './admin'

require('dotenv').config()

export const getHttpServer = async () => {
  const connection = await createConnection(
    process.env.DATABASE_URL,
    Boolean(process.env.DATABASE_DISABLE_SSL),
  )
  logger.info(`Starting in mode: ${process.env.NODE_ENV}`)

  const app = express()

  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))

  const adminBro = admin(connection)
  const router = AdminBroExpress.buildRouter(adminBro)
  app.use(adminBro.options.rootPath, router)

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
        editRammeHandler(req, res)
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

  logger.info(`(APP) Listening at port ${port}`)
  return app.listen(port)
}
