import { Activity } from '../../entity/Activity'
import { getCurrentWeekNumber } from '../../utils'

const DEFAULT_DATA: Partial<Activity> = {
  shortId: 'shortid',
  name: 'default-activity',
  username: 'default-user',
  week: getCurrentWeekNumber(),
  createdAt: new Date(),
  updatedAt: new Date(),
}

export const createActivityFixture = (data: Partial<Activity>) => {
  return {
    ...DEFAULT_DATA,
    ...data,
  }
}
