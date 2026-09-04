import { describe, it, expect } from "vitest";
import { escapeHtml } from "@/utils/escapeHtml";

describe("escapeHtml", () => {
  it("escapes markup in attacker-controlled names", () => {
    const name = `<img src=x onerror="alert(document.domain)">`;
    const out = escapeHtml(name);
    // No raw markup openers may survive; the text "onerror" may still appear
    // as inert escaped text, but never inside a real attribute.
    expect(out).not.toMatch(/<[a-zA-Z/!]/);
    expect(out).not.toContain('onerror="');
    expect(out).toContain("&lt;img");
    expect(out).toContain("onerror=&quot;");
  });

  it("escapes script tags and quotes", () => {
    expect(escapeHtml(`</span><script>alert(1)</script>`)).toBe(
      "&lt;/span&gt;&lt;script&gt;alert(1)&lt;/script&gt;"
    );
    expect(escapeHtml(`a"b'c`)).toBe("a&quot;b&#39;c");
    expect(escapeHtml(`&`)).toBe("&amp;");
  });

  it("leaves plain legitimate text unchanged", () => {
    expect(escapeHtml("Aisha Khan")).toBe("Aisha Khan");
    expect(escapeHtml("Class 5-A")).toBe("Class 5-A");
    expect(escapeHtml("")).toBe("");
    expect(escapeHtml(null)).toBe("");
  });
});
