import { parseIdFromCommand } from './parseIdFromCommand'

describe('parseIdFromCommand', () => {
  let message: string

  const id = 'PeDLIAfJ'
  beforeEach(() => {
    message = ''
  })

  describe('happy case', () => {
    it('should find id', () => {
      message = `edit ${id}`
      const res = parseIdFromCommand(message)
      expect(res).toEqual(id)
    })

    it('should find id with trailing stuff', () => {
      message = `edit ${id} new activity`
      const res = parseIdFromCommand(message)
      expect(res).toEqual(id)
    })
  })

  describe('unhappy case', () => {
    it('should return undefined if id is not normal length', () => {
      message = `edit ${id}123 new activity`
      const res = parseIdFromCommand(message)
      expect(res).toBeUndefined()
    })
  })
})
