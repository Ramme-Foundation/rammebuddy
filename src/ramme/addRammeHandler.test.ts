import { mockRepoFactory } from '../core/test.fixture'
import { addRammeHandler } from './addRammeHandler'

describe('addRammeHandler', () => {
  let req: any
  let res: any
  let repo: any

  const addHandler = addRammeHandler

  beforeEach(() => {
    jest.resetAllMocks()
    repo = mockRepoFactory()
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
    it('should save ramme', async () => {
      expect.assertions(1)
      req.body.text = 'add testpass'
      await addHandler(req, res, repo)
      expect(repo.save).toHaveBeenCalled()
    })
  })
})
