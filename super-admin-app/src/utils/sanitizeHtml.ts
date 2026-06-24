import DOMPurify from 'dompurify'
import type { Config } from 'dompurify'

const richHtmlConfig: Config = {
  USE_PROFILES: { html: true },
  ALLOWED_TAGS: [
    'p', 'br', 'strong', 'b', 'em', 'i', 'u', 's', 'span', 'div',
    'ul', 'ol', 'li', 'sub', 'sup', 'table', 'thead', 'tbody', 'tr', 'th', 'td',
    'blockquote', 'code', 'pre', 'hr'
  ],
  ALLOWED_ATTR: ['class', 'colspan', 'rowspan', 'aria-label'],
  FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'link', 'meta', 'form', 'input', 'button', 'img'],
  FORBID_ATTR: ['style', 'src', 'srcset', 'href', 'xlink:href']
}

export function sanitizeRichHtml(html: string | null | undefined): string {
  return DOMPurify.sanitize(html ?? '', richHtmlConfig)
}

export function sanitizedInnerHtml(html: string | null | undefined): { __html: string } {
  return { __html: sanitizeRichHtml(html) }
}
