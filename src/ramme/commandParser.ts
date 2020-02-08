export const commandParser = (message: string) => {
  let command
  try {
    command = message.split(' ')[1]
  } catch (error) {}
  return command
}
