import { commandParser } from './commandParser'

describe('command parser', () => {
  const parser = commandParser

  describe('unhappy case', () => {
    it('should return undefined if message is just one word (cannot be ramme command)', () => {
      const incoming = 'hejhopp'
      const command = parser(incoming)
      expect(command).toBeUndefined()
    })

    it('should return undefined if message is multiple words does not start with /ramme', () => {
      const incoming = 'hejhopp log'
      const command = parser(incoming)
      expect(command).toBeUndefined()
    })

    it('should return undefined if message is just /ramme', () => {
      const incoming = '/ramme'
      const command = parser(incoming)
      expect(command).toBeUndefined()
    })
  })

  describe('happy case', () => {
    it('should find log in "/ramme log ett pass"', () => {
      const incoming = '/ramme log ett pass'
      const command = parser(incoming)
      expect(command).toBe('log')
    })
  })
})
