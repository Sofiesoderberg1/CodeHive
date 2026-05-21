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
})
