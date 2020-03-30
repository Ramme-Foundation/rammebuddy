import { parseActivity } from './parseActivity'

describe('parseActivity', () => {
  it('return splits week and message', () => {
    expect(parseActivity('en banan vecka 13')).toEqual({
      week: 13,
      message: 'en banan',
    })
    expect(parseActivity('en banan eller två vecka 10')).toEqual({
      week: 10,
      message: 'en banan eller två',
    })
  })

  it('can parse week in front of message', () => {
    expect(parseActivity('vecka 13 en banan')).toEqual({
      week: 13,
      message: 'en banan',
    })
  })
  it('can parse week with just a number', () => {
    expect(parseActivity('en banan 13')).toEqual({
      week: 13,
      message: 'en banan',
    })
  })
})
