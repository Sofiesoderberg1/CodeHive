import { describe, test, expect }
  from 'vitest'

import { getRoomId }
  from '../js/chatUtils.js'

describe('getRoomId', () => {
  test('creates same room id regardless of user order', () => {
    const room1 =
      getRoomId('sofie', 'emma')

    const room2 =
      getRoomId('emma', 'sofie')

    expect(room1).toBe(room2)
  })

  test('joins users with underscore', () => {
    const room =
      getRoomId('sofie', 'emma')

    expect(room).toContain('_')
  })

  test('returns string', () => {
    const room =
      getRoomId('sofie', 'emma')

    expect(typeof room).toBe('string')
  })

  test('works with numbers as strings', () => {
    const room =
      getRoomId('1', '2')

    expect(room).toBe('1_2')
  })

  test('same user creates same room id', () => {
    const room =
      getRoomId('sofie', 'sofie')

    expect(room).toBe('sofie_sofie')
  })
})
