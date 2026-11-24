import { describe, expect, it } from "vitest";
import { calculateRefereeStatistics } from "./statistics";
import { createSeasonRange, type HistoricalMatch, type RefereeAssignment } from "./domain";

const base: HistoricalMatch = { id: 1, seasonId: "2026-2027", iso: "2026-11-23T14:00:00+03:00", league: "Demo", category: "U14", home: "A", away: "B", venue: "Salon", district: "Çorlu", status: "Tamamlandı" };
const assignment = (matchId:number,status:"Aktif"|"Değiştirildi"|"İptal Edildi"="Aktif"):RefereeAssignment => ({ id:`a-${matchId}-${status}`,matchId,refereeId:34,role:"Başhakem",status,classificationSnapshot:"İl Hakemi" });

describe("multi-season referee statistics", () => {
  it("keeps old seasons selectable when 2027-2028 becomes active", () => {
    const seasons = createSeasonRange(2022, 2027, "2027-2028");
    expect(seasons.some(season => season.id === "2025-2026")).toBe(true);
    expect(seasons.find(season => season.id === "2027-2028")?.active).toBe(true);
  });

  it("counts completed and upcoming matches but excludes cancelled and postponed matches", () => {
    const matches:HistoricalMatch[]=[base,{...base,id:2,status:"Planlandı"},{...base,id:3,status:"İptal Edildi"},{...base,id:4,status:"Ertelendi"}];
    const stat=calculateRefereeStatistics(matches,[1,2,3,4].map(id=>assignment(id)),"2026-2027")[33];
    expect(stat.season).toBe(2); expect(stat.upcoming).toBe(1);
  });

  it("does not count changed assignments or duplicate match assignments twice", () => {
    const stat=calculateRefereeStatistics([base],[assignment(1),{...assignment(1),id:"duplicate",role:"Yardımcı Hakem"},assignment(1,"Değiştirildi")],"2026-2027")[33];
    expect(stat.season).toBe(1); expect(stat.career).toBe(1);
  });

  it("preserves career totals while filtering a single season", () => {
    const old={...base,id:2,seasonId:"2025-2026" as const,iso:"2025-11-23T14:00:00+03:00"};
    const stat=calculateRefereeStatistics([base,old],[assignment(1),assignment(2)],"2026-2027")[33];
    expect(stat.season).toBe(1); expect(stat.career).toBe(2);
  });
});
