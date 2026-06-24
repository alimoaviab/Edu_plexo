import { describe, expect, it } from 'vitest'
import { sanitizeRichHtml } from '@/utils/sanitizeHtml'

describe('sanitizeRichHtml', () => {
  it('removes executable tags and event handlers while preserving safe formatting', () => {
    const dirty = '<p onclick="alert(1)"><strong>Hello</strong><script>alert(1)</script><img src=x onerror=alert(2)></p>'

    const clean = sanitizeRichHtml(dirty)

    expect(clean).toContain('<strong>Hello</strong>')
    expect(clean).not.toContain('script')
    expect(clean).not.toContain('onclick')
    expect(clean).not.toContain('onerror')
    expect(clean).not.toContain('<img')
  })
})