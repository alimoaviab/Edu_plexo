import { showToast } from "@/utils/toast";
import { describe, expect, it } from 'vitest'
import { sanitizeRichHtml } from '@/utils/sanitizeHtml'

describe('sanitizeRichHtml', () => {
  it('removes executable tags and event handlers while preserving safe formatting', () => {
    const dirty = '<p onclick="showToast(1, "info")"><strong>Hello</strong><script>showToast(1, "info")</script><img src=x onerror=showToast(2, "info")></p>'

    const clean = sanitizeRichHtml(dirty)

    expect(clean).toContain('<strong>Hello</strong>')
    expect(clean).not.toContain('script')
    expect(clean).not.toContain('onclick')
    expect(clean).not.toContain('onerror')
    expect(clean).not.toContain('<img')
  })
})