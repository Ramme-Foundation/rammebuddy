import supertest from 'supertest'
import { Server } from 'http'
import { getHttpServer } from '../../../server'
import { getRepository, getConnection } from 'typeorm'
import { Activity } from '../../../entity/Activity'
import { getCurrentWeekNumber } from '../../../utils/getCurrentWeekNumber'
import { createActivityFixture } from '../../fixtures/activity'

let app: Server

describe('command', () => {
  describe('week', () => {
    beforeAll(async () => {
      app = await getHttpServer()
    })

    afterAll(() => {
      getConnection().close()
      app.close()
    })

    afterEach(async () => {
      await getRepository(Activity).query(`DELETE FROM activity;`)
    })

    it('returns a curated list of weekly activities', async done => {
      await getRepository(Activity).save([
        createActivityFixture({
          shortId: '123',
          username: 'testing',
          name: 'cross fit',
        }),
        createActivityFixture({
          shortId: '456',
          username: 'testing-2',
          name: 'running',
        }),
        createActivityFixture({
          shortId: '789',
          username: 'testing',
          name: 'running',
        }),
      ])

      const { body } = await supertest
        .agent(app)
        .post('/ramme')
        .send({ text: 'week' })
        .set('Accept', 'application/json')

      expect(body.response_type).toEqual('in_channel')
      expect(body.blocks).toEqual([
        {
          text: {
            text: '*testing:* [2] cross fit, running',
            type: 'mrkdwn',
          },
          type: 'section',
        },
        {
          text: {
            text: '*testing-2:* [1] running',
            type: 'mrkdwn',
          },
          type: 'section',
        },
      ])
      done()
    })
    xit('returns only get activities from this week', async done => {
      await getRepository(Activity).save([
        createActivityFixture({
          shortId: '123',
          username: 'testing',
          week: 80,
          name: 'cross fit',
        }),
        createActivityFixture({
          shortId: '456',
          username: 'testing-2',
          name: 'running',
        }),
        createActivityFixture({
          shortId: '789',
          username: 'testing',
          name: 'running',
        }),
      ])

      const { body } = await supertest
        .agent(app)
        .post('/ramme')
        .set('Accept', 'application/json')
        .send({ text: 'week' })

      expect(body.response_type).toEqual('in_channel')
      expect(body.blocks).toEqual([
        {
          text: {
            text: '*testing:* [2] running',
            type: 'mrkdwn',
          },
          type: 'section',
        },
        {
          text: {
            text: '*testing-2:* [1] running',
            type: 'mrkdwn',
          },
          type: 'section',
        },
      ])
      done()
    })

    it('can display specified week', async done => {
      await getRepository(Activity).save([
        createActivityFixture({
          shortId: '123',
          username: 'testing',
          week: 80,
          name: 'cross fit',
        }),
        createActivityFixture({
          shortId: '456',
          username: 'testing-2',
          name: 'running',
        }),
      ])

      const { body } = await supertest
        .agent(app)
        .post('/ramme')
        .send({ text: 'week 80' })

      expect(body.response_type).toEqual('in_channel')
      expect(body.blocks).toEqual([
        {
          text: {
            text: '*testing:* [1] cross fit',
            type: 'mrkdwn',
          },
          type: 'section',
        },
      ])
      done()
    })
  })
})
