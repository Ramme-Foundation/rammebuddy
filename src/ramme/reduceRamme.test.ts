import { reduceRamme } from './reduceRamme'
describe('Ramme reducer', () => {
  let mockEventArray: any

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should return initial ramme activity for RAMME_ADDED', async () => {
    mockEventArray = [
      {
        id: '123',
        version: 0,
        event: 'RAMME_ADDED',
        data: {
          activity: 'testpass',
        },
      },
    ]

    const result = reduceRamme(mockEventArray)
    expect(result).toStrictEqual({ activity: 'testpass' })
  })

  it('should return edited ramme activity for RAMME_ADDED + RAMME_ACTIVITY_EDITED', async () => {
    mockEventArray = [
      {
        id: '123',
        version: 0,
        event: 'RAMME_ADDED',
        data: {
          activity: 'testpass',
        },
      },
      {
        id: '123',
        version: 1,
        event: 'RAMME_ACTIVITY_EDITED',
        data: {
          activity: 'edited testpass',
        },
      },
    ]

    const result = reduceRamme(mockEventArray)
    expect(result).toStrictEqual({ activity: 'edited testpass' })
  })

  it('should return last ramme activity for multiple RAMME_ACTIVITY_EDITED after RAMME_ADDED', async () => {
    mockEventArray = [
      {
        id: '123',
        version: 0,
        event: 'RAMME_ADDED',
        data: {
          activity: 'testpass',
        },
      },
      {
        id: '123',
        version: 1,
        event: 'RAMME_ACTIVITY_EDITED',
        data: {
          activity: 'edited testpass',
        },
      },
      {
        id: '123',
        version: 2,
        event: 'RAMME_ACTIVITY_EDITED',
        data: {
          activity: 'edited testpass final',
        },
      },
    ]

    const result = reduceRamme(mockEventArray)
    expect(result).toStrictEqual({ activity: 'edited testpass final' })
  })

  it('should return undefined if last event is RAMME_ARCHIVED', async () => {
    mockEventArray = [
      {
        id: '123',
        event: 'RAMME_ADDED',
        version: 0,
        data: {
          activity: 'testpass',
        },
      },
      {
        id: '123',
        version: 1,
        event: 'RAMME_ACTIVITY_EDITED',
        data: {
          activity: 'edited testpass',
        },
      },
      {
        version: 2,
        id: '123',
        event: 'RAMME_ARCHIVED',
      },
    ]

    const result = reduceRamme(mockEventArray)
    expect(result).toStrictEqual(undefined)
  })
})
