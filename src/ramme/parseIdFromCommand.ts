import { generateId } from '../utils'

export const parseIdFromCommand = (command: string) => {
  try {
    const id = command.trim().split(' ')[1]
    return id.length === generateId().length ? id : undefined
  } catch (e) {}
}
