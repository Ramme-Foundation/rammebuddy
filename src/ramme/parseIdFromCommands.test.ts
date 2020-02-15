import { parseIdFromCommand } from './parseIdFromCommand'

describe('parseIdFromCommand', () => {
  let message: string

  const id = '4efab678-d9ca-412c-b2a1-61197df2aedd'
  beforeEach(() => {
    message = ''
  })

  describe('happy case', () => {
    it('should find id', () => {
      message = `/ramme edit ${id}`
      const res = parseIdFromCommand(message)
      expect(res).toEqual(id)
    })

    it('should find id with trailing stuff', () => {
      message = `/ramme edit ${id} new activity`
      const res = parseIdFromCommand(message)
      expect(res).toEqual(id)
    })
  })
})
