import { Event } from '../core'
import { Ramme, RammeEvents } from '.'
import { logger } from '../utils/logger'

const isEmptyObj = (obj: any) =>
  Object.entries(obj).length === 0 && obj.constructor === Object

export const reduceRamme = (events: Event<Ramme>[]) => {
  let ramme: Partial<Ramme> = {}

  events.forEach((e: Event<Ramme>) => {
    const event = e.event
    switch (event) {
      case RammeEvents.RammeAdded: {
        ramme = e.data as Ramme
        break
      }
      case RammeEvents.RammeActivityEdited: {
        ramme.activity = e.data!.activity
        break
      }
      case RammeEvents.RammeArchived: {
        ramme = {}
        break
      }
      default: {
        logger.warn(
          `Unknown ramme event ${event} found belonging to aggregate_id ${e.id}`,
        )
      }
    }
  })

  return !isEmptyObj(ramme) ? ramme : undefined
}
