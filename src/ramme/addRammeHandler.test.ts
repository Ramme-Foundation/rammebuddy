import { mockRepoFactory } from '../core/test.fixture'
import { addRammeHandler } from './addRammeHandler'
import { getCurrentWeekNumber } from '../utils'

describe('addRammeHandler', () => {
  let req: any
  let res: any
  let repo: any

  const addHandler = addRammeHandler

  beforeEach(() => {
    jest.resetAllMocks()
    repo = mockRepoFactory({
      save: jest.fn().mockResolvedValue('abcdefgh'),
    })
    res = {
      send: jest.fn(),
      status: jest.fn(),
    }
    req = {
      body: {
        user_name: 'Florida Man',
        text: undefined,
      },
    }
  })

  describe('happy case', () => {
    it('should save ramme on valid testpass command', async () => {
      expect.assertions(1)
      req.body.text = 'add testpass'
      await addHandler(req, res, repo)
      expect(repo.save).toHaveBeenCalled()
    })

    it('should set status 200', async () => {
      expect.assertions(1)
      req.body.text = 'add testpass'
      await addHandler(req, res, repo)
      expect(res.status).toHaveBeenCalledWith(200)
    })

    it('should reply with proper slack api body', async () => {
      expect.assertions(1)
      req.body.text = 'add testpass'
      await addHandler(req, res, repo)
      expect(res.send).toHaveBeenCalledWith({
        response_type: 'in_channel',
        text: `aktivitet "testpass" loggad i vecka ${getCurrentWeekNumber()} med ID: abcdefgh av Florida Man`,
      })
    })
  })
})
