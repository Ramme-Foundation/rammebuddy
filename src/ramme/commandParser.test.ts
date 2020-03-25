import { commandParser } from './commandParser'

describe('command parser', () => {
  const parser = commandParser

  describe('unhappy case', () => {
    it('should return help if incoming is empty', () => {
      const incoming = ''
      const command = parser(incoming)
      expect(command).toEqual('help')
    })
  })

  describe('happy case', () => {
    it('should find log in "log ett pass"', () => {
      const incoming = 'log ett pass'
      const command = parser(incoming)
      expect(command).toBe('log')
    })
  })
})
