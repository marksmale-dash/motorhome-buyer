import { describe, expect, it } from 'vitest'

import { normalizeEmail, normalizeOtp, verifyEmailOtp } from './auth'

describe('OTP input normalization', () => {
  it('normalizes an email address for both OTP request and verification', () => {
    expect(normalizeEmail('  Person@Example.COM ')).toBe('person@example.com')
  })

  it('keeps only the six-digit email OTP accepted by the UI', () => {
    expect(normalizeOtp(' 12a34-56 ')).toBe('123456')
    expect(normalizeOtp('123456789')).toBe('123456')
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

    await verifyEmailOtp(supabase, ' Person@Example.COM ', '12a34-56')

    expect(calls).toEqual([
      { email: 'person@example.com', token: '123456', type: 'email' },
    ])
  })
})
