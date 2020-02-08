import { rammeReducer } from './rammeReducer'
describe('Ramme reducer', () => {
  let mockRepo: any
  let reducer: any
  beforeEach(() => {
    jest.resetAllMocks()
    mockRepo = {
      get: jest.fn(),
    }
    reducer = undefined
  })

  it('should return initial ramme activity for RAMME_ADDED', async () => {
    mockRepo.get = jest.fn().mockResolvedValue([
      {
        id: '123',
        event: 'RAMME_ADDED',
        data: {
          activity: 'testpass',
        },
      },
    ])

    reducer = rammeReducer(mockRepo)
    const result = await reducer('123')
    expect(result).toStrictEqual({ activity: 'testpass' })
  })

  it('should return edited ramme activity for RAMME_ADDED + RAMME_ACTIVITY_EDITED', async () => {
    mockRepo.get = jest.fn().mockResolvedValue([
      {
        id: '123',
        event: 'RAMME_ADDED',
        data: {
          activity: 'testpass',
        },
      },
      {
        id: '123',
        event: 'RAMME_ACTIVITY_EDITED',
        data: {
          activity: 'edited testpass',
        },
      },
    ])

    reducer = rammeReducer(mockRepo)
    const result = await reducer('123')
    expect(result).toStrictEqual({ activity: 'edited testpass' })
  })

  it('should return last ramme activity for multiple RAMME_ACTIVITY_EDITED after RAMME_ADDED', async () => {
    mockRepo.get = jest.fn().mockResolvedValue([
      {
        id: '123',
        event: 'RAMME_ADDED',
        data: {
          activity: 'testpass',
        },
      },
      {
        id: '123',
        event: 'RAMME_ACTIVITY_EDITED',
        data: {
          activity: 'edited testpass',
        },
      },
      {
        id: '123',
        event: 'RAMME_ACTIVITY_EDITED',
        data: {
          activity: 'edited testpass final',
        },
      },
    ])

    reducer = rammeReducer(mockRepo)
    const result = await reducer('123')
    expect(result).toStrictEqual({ activity: 'edited testpass final' })
  })

  it('should return undefined if last event is RAMME_ARCHIVED', async () => {
    mockRepo.get = jest.fn().mockResolvedValue([
      {
        id: '123',
        event: 'RAMME_ADDED',
        data: {
          activity: 'testpass',
        },
      },
      {
        id: '123',
        event: 'RAMME_ACTIVITY_EDITED',
        data: {
          activity: 'edited testpass',
        },
      },
      {
        id: '123',
        event: 'RAMME_ARCHIVED',
      },
    ])

    reducer = rammeReducer(mockRepo)
    const result = await reducer('123')
    expect(result).toStrictEqual(undefined)
  })
})
