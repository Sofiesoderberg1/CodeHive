import {
  getUsernameFromEmail,
  validatePassword,
  validateBooking,
  validateMessage,
  matchProject,
  isValidEmail,
  capitalizeName,
  truncateText,
  isBookingInFuture,
  formatUsername
} from '../js/utils.js'

import {
  describe,
  test,
  expect
} from 'vitest'

describe('getUsernameFromEmail', () => {
  test('extracts username', () => {
    expect(
      getUsernameFromEmail(
        'sofie@gmail.com'
      )
    ).toBe('sofie')
  })
})

describe('validatePassword', () => {
  test('accepts valid password', () => {
    expect(
      validatePassword('123456')
    ).toBe(true)
  })

  test('rejects short password', () => {
    expect(
      validatePassword('123')
    ).toBe(false)
  })
})

describe('validateBooking', () => {
  test('accepts valid booking', () => {
    expect(
      validateBooking(
        'Sofie',
        'test@test.com',
        '2026-01-01'
      )
    ).toBe(true)
  })

  test('rejects missing name', () => {
    expect(
      validateBooking(
        '',
        'test@test.com',
        '2026-01-01'
      )
    ).toBe(false)
  })
})

describe('validateMessage', () => {
  test('accepts message', () => {
    expect(
      validateMessage('hello')
    ).toBe(true)
  })

  test('rejects empty message', () => {
    expect(
      validateMessage('   ')
    ).toBe(false)
  })
})

describe('matchProject', () => {
  test('matches ecommerce', () => {
    expect(
      matchProject(
        'I need a payment shop'
      )
    ).toBe('E-commerce site')
  })

  test('matches chat app', () => {
    expect(
      matchProject(
        'I need a chat system'
      )
    ).toBe('Chat app')
  })

  test('returns null if no match', () => {
    expect(
      matchProject(
        'something random'
      )
    ).toBe(null)
  })
})
describe('isValidEmail', () => {
  test('accepts valid email', () => {
    expect(isValidEmail('test@test.com')).toBe(true)
  })

  test('rejects invalid email', () => {
    expect(isValidEmail('test')).toBe(false)
  })
})

describe('capitalizeName', () => {
  test('capitalizes first letter', () => {
    expect(capitalizeName('sofie')).toBe('Sofie')
  })
})

describe('truncateText', () => {
  test('truncates text', () => {
    expect(truncateText('Hello World', 5))
      .toBe('Hello')
  })
})

describe('isBookingInFuture', () => {
  test('accepts future date', () => {
    expect(
      isBookingInFuture('2030-01-01')
    ).toBe(true)
  })
})

describe('formatUsername', () => {
  test('formats username', () => {
    expect(
      formatUsername('  SOFIE ')
    ).toBe('sofie')
  })
})
