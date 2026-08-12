import { readFileSync } from 'node:fs'

import { describe, expect, it } from 'vitest'

describe('Settings dialog presentation', () => {
  it('renders the settings portal as a visible fixed overlay', () => {
    const css = readFileSync(new URL('./app.css', import.meta.url), 'utf8')

    expect(css).toMatch(/\.settings-backdrop\{[^}]*position:fixed/)
    expect(css).toMatch(/\.settings-backdrop\{[^}]*z-index:1300/)
    expect(css).toMatch(/\.settings-panel\{[^}]*background:#fff/)
    expect(css).toContain('@media(max-width:740px){.settings-button')
  })
})
