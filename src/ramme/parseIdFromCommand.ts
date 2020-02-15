import uuid = require('uuid')

export const parseIdFromCommand = (command: string) => {
  try {
    const id = command.trim().split(' ')[2]
    return id.length === uuid().length ? id : undefined
  } catch (e) {}
}
