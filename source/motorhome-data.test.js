import { describe, expect, it, vi } from 'vitest'

import { isFacebookAdvert, saveMotorhome } from './motorhome-data'

function supabaseMock({ userId = 'user-1', householdId = 'household-1' } = {}) {
  const calls = { insert: [], update: [] }
  const membership = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    maybeSingle: vi.fn(async () => ({
      data: householdId ? { household_id: householdId } : null,
      error: null,
    })),
  }
  const motorhomes = {
    insert: vi.fn(async (value) => {
      calls.insert.push(value)
      return { error: null }
    }),
    update: vi.fn((value) => {
      calls.update.push(value)
      return { eq: vi.fn(async () => ({ error: null })) }
    }),
  }
  return {
    calls,
    client: {
      auth: { getUser: vi.fn(async () => ({ data: { user: { id: userId } } })) },
      from: vi.fn((table) =>
        table === 'household_members' ? membership : motorhomes,
      ),
    },
  }
}

describe('motorhome persistence', () => {
  it('creates a new motorhome with zero photos and explicit ownership', async () => {
    const { client, calls } = supabaseMock()
    const result = await saveMotorhome(client, {
      make: 'Hymer',
      model: 'B-Class',
      photo_urls: [],
    })

    expect(calls.insert).toHaveLength(1)
    expect(calls.insert[0]).toMatchObject({
      household_id: 'household-1',
      created_by: 'user-1',
      updated_by: 'user-1',
      photo_urls: [],
    })
    expect(result.motorhome.id).toEqual(expect.any(String))
  })

  it('cannot submit a new record for another household', async () => {
    const { client, calls } = supabaseMock({ householdId: 'allowed-household' })

    await saveMotorhome(client, {
      make: 'Hymer',
      model: 'B-Class',
      household_id: 'another-household',
    })

    expect(calls.insert[0].household_id).toBe('allowed-household')
    expect(calls.insert[0].household_id).not.toBe('another-household')
  })

  it('preserves updates without creating a duplicate record', async () => {
    const { client, calls } = supabaseMock()

    const result = await saveMotorhome(client, {
      id: 'existing-motorhome',
      household_id: 'household-1',
      make: 'Hymer',
      model: 'Updated model',
    })

    expect(calls.insert).toHaveLength(0)
    expect(calls.update).toHaveLength(1)
    expect(calls.update[0]).toMatchObject({
      id: 'existing-motorhome',
      updated_by: 'user-1',
    })
    expect(result.created).toBe(false)
  })

  it('preserves Facebook advert detection for post-save photo recovery', () => {
    expect(isFacebookAdvert('https://www.facebook.com/marketplace/item/123')).toBe(true)
    expect(isFacebookAdvert('https://fb.com/marketplace/item/123')).toBe(true)
    expect(isFacebookAdvert('https://example.com/motorhome')).toBe(false)
  })
})
