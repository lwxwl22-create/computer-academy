import { describe, expect, it } from "vitest";
import { modules } from "@/content";
import { fuzzyMatch, searchAll } from "@/lib/search";

describe("search", () => {
  it("finds lessons by fuzzy match", () => {
    const hits = searchAll(modules, "快捷键");
    expect(hits.length).toBeGreaterThan(0);
    expect(hits.some((h) => h.title.includes("快捷键"))).toBe(true);
  });

  it("finds hardware terms", () => {
    const hits = searchAll(modules, "SSD");
    expect(hits.length).toBeGreaterThan(0);
  });

  it("returns empty for blank query", () => {
    expect(searchAll(modules, "  ")).toHaveLength(0);
  });

  it("scores exact matches above fuzzy", () => {
    const exact = fuzzyMatch("cpu", "CPU 详解");
    const loose = fuzzyMatch("cpu", "中央处理器");
    expect(exact).toBeGreaterThan(loose);
  });
});
