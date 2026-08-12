import { describe, expect, it } from 'vitest'

import { EMPTY_MOTORHOME } from './motorhome-defaults'

describe('new motorhome defaults', () => {
  it('does not prefill assessment answers', () => {
    const allowedStructuralDefaults = new Set(['photo_urls'])

    for (const [field, value] of Object.entries(EMPTY_MOTORHOME)) {
      if (allowedStructuralDefaults.has(field)) continue
      expect([false, ''], `${field} should start unanswered`).toContain(value)
    }
    expect(EMPTY_MOTORHOME.photo_urls).toEqual([])
  })
})
