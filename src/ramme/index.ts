export * from './addRammeHandler'
export * from './editRammeHandler'
export * from './archiveRammeHandler'
export * from './getByWeekHandler'
export * from './commandParser'
export * from './reduceRamme'

export type Ramme = {
  activity: string
}

export enum RammeEvents {
  RammeAdded = 'RAMME_ADDED',
  RammeActivityEdited = 'RAMME_ACTIVITY_EDITED',
  RammeArchived = 'RAMME_ARCHIVED',
}
