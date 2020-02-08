import { UUID, Repository, Event } from '../core'
import { Ramme, RammeEvents } from '.'
import { logger } from '../utils/logger'

const isEmptyObj = (obj: any) =>
  Object.entries(obj).length === 0 && obj.constructor === Object

export const rammeReducer = (repository: Repository<Ramme>) => async (
  rammeId: UUID,
) => {
  const eventsForId = await repository.get<Ramme>(rammeId)

  let ramme: Partial<Ramme> = {}

  eventsForId.forEach((e: Event<Ramme>) => {
    const event = e.event
    switch (event) {
      case RammeEvents.RammeAdded: {
        ramme = e.data
        break
      }
      case RammeEvents.RammeActivityEdited: {
        ramme.activity = e.data.activity
        break
      }
      case RammeEvents.RammeArchived: {
        ramme = {}
        break
      }
      default: {
        logger.warn(
          `Unknown ramme event ${event} found in aggregate id ${e.id}`,
        )
      }
    }
  })

  return !isEmptyObj(ramme) ? ramme : undefined
}
