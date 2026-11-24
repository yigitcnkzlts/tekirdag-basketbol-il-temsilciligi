import { describe, expect, it } from "vitest";
import { matches, programMeta } from "./data";
import { clubs, referees } from "./public-data";

describe("public data integrity", () => {
  it("contains exactly 35 provincial referees", () => {
    expect(referees).toHaveLength(35);
    expect(referees.every(referee => referee.classification === "İl Hakemi")).toBe(true);
    expect(new Set(referees.map(referee => referee.name)).size).toBe(35);
  });

  it("keeps every exported match complete", () => {
    expect(matches.length).toBeGreaterThan(0);
    for (const match of matches) {
      expect(match.home).toBeTruthy();
      expect(match.away).toBeTruthy();
      expect(match.venue).toBeTruthy();
      expect(match.referees.length).toBeGreaterThan(0);
    }
    expect(programMeta.version).toMatch(/^v\d+\.\d+$/);
  });

  it("marks all fictional clubs as demo", () => {
    expect(clubs.every(club => club.demo)).toBe(true);
  });
});
