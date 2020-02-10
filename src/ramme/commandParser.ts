export const commandParser = (message: string) => {
  let command
  try {
    if (!message.startsWith('/ramme')) return undefined
    command = message.split(' ')[1]
  } catch (error) {}
  return command
}
