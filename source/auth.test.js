import { describe, expect, it } from 'vitest'

import {
  isValidOtp,
  normalizeEmail,
  normalizeOtp,
  verifyEmailOtp,
} from './auth'

describe('OTP input normalization', () => {
  it('normalizes an email address for both OTP request and verification', () => {
    expect(normalizeEmail('  Person@Example.COM ')).toBe('person@example.com')
  })

  it('accepts the current eight-digit Supabase email OTP', () => {
    expect(normalizeOtp(' 12a34-5678 ')).toBe('12345678')
    expect(isValidOtp('12345678')).toBe(true)
  })

  it('supports Supabase email OTP lengths from 6 through 10 digits', () => {
    expect(isValidOtp('12345')).toBe(false)
    expect(isValidOtp('123456')).toBe(true)
    expect(isValidOtp('1234567890')).toBe(true)
    expect(isValidOtp('12345678901')).toBe(false)
    expect(normalizeOtp('12345678901')).toBe('1234567890')
  })

  it('uses the Supabase email verification type for signInWithOtp codes', async () => {
    const calls = []
    const supabase = {
      auth: {
        verifyOtp: async (params) => {
          calls.push(params)
          return { data: { session: {} }, error: null }
        },
      },
    }

    await verifyEmailOtp(supabase, ' Person@Example.COM ', '12a34-5678')

    expect(calls).toEqual([
      { email: 'person@example.com', token: '12345678', type: 'email' },
    ])
  })
})
