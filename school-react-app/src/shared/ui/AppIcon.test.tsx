import { describe, expect, it } from "vitest";

import { resolveAppIconName } from "./AppIcon";

describe("resolveAppIconName", () => {
  it("resolves Lucide names across casing and separators", () => {
    expect(resolveAppIconName("RefreshCw")).toBe("RefreshCw");
    expect(resolveAppIconName("refresh_cw")).toBe("RefreshCw");
    expect(resolveAppIconName("calendar-x2")).toBe("CalendarX2");
  });

  it("resolves the expanded material aliases", () => {
    expect(resolveAppIconName("Chat")).toBe("MessageSquare");
    expect(resolveAppIconName("forum")).toBe("MessageCircle");
    expect(resolveAppIconName("Title")).toBe("Type");
    expect(resolveAppIconName("Leaderboard")).toBe("BarChart3");
    expect(resolveAppIconName("PendingActions")).toBe("Clock3");
    expect(resolveAppIconName("CloudDone")).toBe("CheckCircle2");
    expect(resolveAppIconName("QueryStats")).toBe("BarChart3");
    expect(resolveAppIconName("Label")).toBe("Tag");
  });
});