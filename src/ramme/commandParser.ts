export const commandParser = (message: string) => {
  let command
  try {
    command = message.length > 0 ? message.split(' ')[0] : 'help'
  } catch (error) {}
  return command
}
